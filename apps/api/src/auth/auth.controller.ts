import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

const COOKIE = 'nexus_session';
function readCookie(request: Request): string | undefined {
  const header = request.headers.cookie;
  if (!header) return undefined;
  const part = header.split(';').map((item) => item.trim()).find((item) => item.startsWith(COOKIE + '='));
  return part ? decodeURIComponent(part.slice(COOKIE.length + 1)) : undefined;
}
function setSessionCookie(response: Response, token: string, expiresAt: Date): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; Path=/api/auth; HttpOnly; SameSite=Strict; Expires=${expiresAt.toUTCString()}${secure}`);
}
function clearSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${COOKIE}=; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: { email?: unknown; password?: unknown }) {
    return this.auth.register(body?.email, body?.password);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email?: unknown; password?: unknown }, @Res({ passthrough: true }) response: Response) {
    const session = await this.auth.login(body?.email, body?.password);
    setSessionCookie(response, session.token, session.expiresAt);
    return { user: session.user, expiresAt: session.expiresAt };
  }

  @Get('me')
  async me(@Req() request: Request) {
    return { user: await this.auth.currentUser(readCookie(request)) };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: Request, @Res() response: Response) {
    await this.auth.logout(readCookie(request));
    clearSessionCookie(response);
    response.status(204).send();
  }
}
