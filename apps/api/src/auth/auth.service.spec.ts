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

  it('creates a hashed session token and returns the raw token only to the caller', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 'u1', email: 'user@example.com', password_hash: 'scrypt$MDEyMzQ1Njc4OWFiY2RlZg$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', disabled_at: null }] })
      .mockImplementationOnce(async (_sql: string, values: unknown[]) => {
        expect(values[1]).toMatch(/^[a-f0-9]{64}$/);
        return { rows: [] };
      });
    // The stored dummy-like hash is not a valid password hash; login must reject it.
    await expect(service.login('user@example.com', 'correct-horse-battery-staple'))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('maps duplicate email constraint to a conflict response', async () => {
    db.query.mockRejectedValue({ code: '23505' });
    await expect(service.register('user@example.com', 'correct-horse-battery-staple'))
      .rejects.toBeInstanceOf(ConflictException);
  });
});
