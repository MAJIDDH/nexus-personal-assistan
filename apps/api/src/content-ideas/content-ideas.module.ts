import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { ContentIdeasController } from './content-ideas.controller';
import { ContentIdeasService } from './content-ideas.service';

@Module({
  imports: [AuthModule],
  controllers: [ContentIdeasController],
  providers: [ContentIdeasService, AuthGuard],
})
export class ContentIdeasModule {}
