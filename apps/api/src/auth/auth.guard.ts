import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

export type AuthenticatedUser = { id: string; email: string };
export type AuthenticatedRequest = { headers: { cookie?: string }; user?: AuthenticatedUser };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookies = request.headers.cookie ?? '';
    const token = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith('nexus_session='))?.slice('nexus_session='.length);
    let decoded: string | undefined;
    if (token) {
      try { decoded = decodeURIComponent(token); } catch { decoded = undefined; }
    }
    request.user = await this.auth.currentUser(decoded);
    return true;
  }
}
