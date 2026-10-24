import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({ imports: [AuthModule], controllers: [AuditController], providers: [AuditService, AuthGuard] })
export class AuditModule {}
