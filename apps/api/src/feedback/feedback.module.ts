import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({ imports: [AuthModule], controllers: [FeedbackController], providers: [FeedbackService, AuthGuard] })
export class FeedbackModule {}
