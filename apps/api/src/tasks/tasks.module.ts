import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({ imports: [AuthModule], controllers: [TasksController], providers: [TasksService, AuthGuard] })
export class TasksModule {}
