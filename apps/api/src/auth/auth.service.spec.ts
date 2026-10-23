import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';

describe('AuthService', () => {
  let service: AuthService;
  let db: { query: jest.Mock };

  beforeEach(() => {
    db = { query: jest.fn() };
    service = new AuthService(db as unknown as DatabaseService);
  });

  it('normalizes email and stores only a password hash on registration', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'u1', email: 'user@example.com', created_at: new Date() }] });
    await service.register(' User@Example.com ', 'correct-horse-battery-staple');
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('INSERT INTO users');
    expect(params[0]).toBe('user@example.com');
    expect(params[1]).toMatch(/^scrypt\$/);
    expect(params[1]).not.toBe('correct-horse-battery-staple');
  });

  it('returns a generic authentication error for unknown users', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(service.login('missing@example.com', 'correct-horse-battery-staple'))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates a hashed session, resolves it, and revokes it on logout', async () => {
    let storedPasswordHash = '';
    db.query.mockImplementation(async (sql: string, values: unknown[] = []) => {
      if (sql.includes('INSERT INTO users')) {
        storedPasswordHash = String(values[1]);
        return { rows: [{ id: 'u1', email: 'user@example.com', created_at: new Date() }] };
      }
      if (sql.includes('SELECT id, email, password_hash')) {
        return { rows: [{ id: 'u1', email: 'user@example.com', password_hash: storedPasswordHash, disabled_at: null }] };
      }
      if (sql.includes('INSERT INTO auth_sessions')) {
        expect(values[1]).toMatch(/^[a-f0-9]{64}$/);
        expect(values[1]).not.toBe(values[0]);
        return { rows: [] };
      }
      if (sql.includes('FROM auth_sessions s JOIN users')) {
        return { rows: [{ id: 'u1', email: 'user@example.com', session_id: 's1' }] };
      }
      return { rows: [] };
    });

    await service.register('user@example.com', 'correct-horse-battery-staple');
    const session = await service.login('user@example.com', 'correct-horse-battery-staple');
    expect(session.token).toHaveLength(43);
    expect(session.user.email).toBe('user@example.com');
    await expect(service.currentUser(session.token)).resolves.toEqual({ id: 'u1', email: 'user@example.com' });
    await service.logout(session.token);
    expect(db.query.mock.calls.some(([sql]) => String(sql).includes('SET revoked_at = now()'))).toBe(true);
  });

  it('rejects an incorrect password without creating a session', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 'u1', email: 'user@example.com', password_hash: 'scrypt$MDEyMzQ1Njc4OWFiY2RlZg$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', disabled_at: null }] });
    await expect(service.login('user@example.com', 'incorrect-password'))
      .rejects.toBeInstanceOf(UnauthorizedException);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('maps duplicate email constraint to a conflict response', async () => {
    db.query.mockRejectedValue({ code: '23505' });
    await expect(service.register('user@example.com', 'correct-horse-battery-staple'))
      .rejects.toBeInstanceOf(ConflictException);
  });
});
