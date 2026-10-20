import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  CONTENT_OBJECTIVES,
  ContentObjective,
  ContentIdeasService,
  CreateContentIdea,
} from './content-ideas.service';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCreateInput(value: unknown): CreateContentIdea {
  if (!isRecord(value)) {
    throw new BadRequestException('Request body must be a JSON object.');
  }

  const allowedKeys = new Set(['title', 'concept', 'objective']);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) {
    throw new BadRequestException('Request contains unsupported fields.');
  }

  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const concept = typeof value.concept === 'string' ? value.concept.trim() : '';
  const objective = value.objective ?? 'grow_followers';

  if (title.length < 1 || title.length > 160) {
    throw new BadRequestException('title must contain 1 to 160 characters.');
  }
  if (concept.length < 1 || concept.length > 5000) {
    throw new BadRequestException('concept must contain 1 to 5000 characters.');
  }
  if (
    typeof objective !== 'string' ||
    !CONTENT_OBJECTIVES.includes(objective as ContentObjective)
  ) {
    throw new BadRequestException('objective is not supported.');
  }

  return {
    title,
    concept,
    objective: objective as ContentObjective,
  };
}

@Controller('content-ideas')
export class ContentIdeasController {
  constructor(private readonly contentIdeas: ContentIdeasService) {}

  @Get()
  list() {
    return this.contentIdeas.list();
  }

  @Post()
  create(@Body() body: unknown) {
    return this.contentIdeas.create(parseCreateInput(body));
  }
}
