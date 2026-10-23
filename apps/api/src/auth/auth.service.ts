import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { DatabaseService } from '../database/database.service';

const scrypt = promisify(scryptCallback);
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_MIN = 12;

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  private normalizeEmail(value: unknown): string {
    if (typeof value !== 'string') throw new BadRequestException('Email and password are required');
    const email = value.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('A valid email is required');
    }
    return email;
  }

  private password(value: unknown): string {
    if (typeof value !== 'string' || value.length < PASSWORD_MIN || value.length > 256) {
      throw new BadRequestException(`Password must be between ${PASSWORD_MIN} and 256 characters`);
    }
    return value;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = (await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })) as Buffer;
    return `scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;
  }

  private async verifyPassword(password: string, stored: string): Promise<boolean> {
    const [algorithm, saltText, hashText] = stored.split('$');
    if (algorithm !== 'scrypt' || !saltText || !hashText) return false;
    try {
      const salt = Buffer.from(saltText, 'base64url');
      const expected = Buffer.from(hashText, 'base64url');
      const actual = (await scrypt(password, salt, expected.length, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })) as Buffer;
      return expected.length === actual.length && timingSafeEqual(expected, actual);
    } catch { return false; }
  }

  private tokenHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async register(emailInput: unknown, passwordInput: unknown) {
    const email = this.normalizeEmail(emailInput);
    const password = this.password(passwordInput);
    const hash = await this.hashPassword(password);
    try {
      const result = await this.db.query<{ id: string; email: string; created_at: Date }>(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [email, hash],
      );
      return result.rows[0];
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('An account with this email already exists');
      throw error;
    }
  }

  async login(emailInput: unknown, passwordInput: unknown): Promise<{ token: string; expiresAt: Date; user: { id: string; email: string } }> {
    const email = this.normalizeEmail(emailInput);
    if (typeof passwordInput !== 'string' || passwordInput.length > 256) throw new UnauthorizedException('Invalid email or password');
    const result = await this.db.query<{ id: string; email: string; password_hash: string; disabled_at: Date | null }>(
      'SELECT id, email, password_hash, disabled_at FROM users WHERE email = $1',
      [email],
    );
    const user = result.rows[0];
    const dummyHash = 'scrypt$MDEyMzQ1Njc4OWFiY2RlZg$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const valid = await this.verifyPassword(passwordInput, user?.password_hash ?? dummyHash);
    if (!user || !valid || user.disabled_at) throw new UnauthorizedException('Invalid email or password');
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await this.db.query('INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [user.id, this.tokenHash(token), expiresAt]);
    return { token, expiresAt, user: { id: user.id, email: user.email } };
  }

  async currentUser(token: string | undefined) {
    if (!token || token.length > 256) throw new UnauthorizedException('Authentication required');
    const result = await this.db.query<{ id: string; email: string; session_id: string }>(
      `SELECT u.id, u.email, s.id AS session_id
       FROM auth_sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now() AND u.disabled_at IS NULL`,
      [this.tokenHash(token)],
    );
    if (!result.rows[0]) throw new UnauthorizedException('Authentication required');
    await this.db.query('UPDATE auth_sessions SET last_seen_at = now() WHERE id = $1', [result.rows[0].session_id]);
    return { id: result.rows[0].id, email: result.rows[0].email };
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token || token.length > 256) return;
    await this.db.query('UPDATE auth_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL', [this.tokenHash(token)]);
  }
}
