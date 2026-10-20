import { Module } from '@nestjs/common';
import { ContentIdeasController } from './content-ideas.controller';
import { ContentIdeasService } from './content-ideas.service';

@Module({
  controllers: [ContentIdeasController],
  providers: [ContentIdeasService],
})
export class ContentIdeasModule {}
