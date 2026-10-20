import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CONTENT_OBJECTIVES,
  ContentObjective,
  ContentIdeasService,
  CreateContentIdea,
  UpdateContentIdea,
} from './content-ideas.service';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseFields(value: unknown, partial: false): CreateContentIdea;
function parseFields(value: unknown, partial: true): UpdateContentIdea;
function parseFields(
  value: unknown,
  partial: boolean,
): CreateContentIdea | UpdateContentIdea {
  if (!isRecord(value)) {
    throw new BadRequestException('Request body must be a JSON object.');
  }

  const allowedKeys = new Set(['title', 'concept', 'objective']);
  const keys = Object.keys(value);
  if (keys.some((key) => !allowedKeys.has(key))) {
    throw new BadRequestException('Request contains unsupported fields.');
  }
  if (partial && keys.length === 0) {
    throw new BadRequestException('At least one editable field is required.');
  }

  const parsed: UpdateContentIdea = {};
  if (!partial || Object.hasOwn(value, 'title')) {
    const title = typeof value.title === 'string' ? value.title.trim() : '';
    if (title.length < 1 || title.length > 160) {
      throw new BadRequestException('title must contain 1 to 160 characters.');
    }
    parsed.title = title;
  }
  if (!partial || Object.hasOwn(value, 'concept')) {
    const concept = typeof value.concept === 'string' ? value.concept.trim() : '';
    if (concept.length < 1 || concept.length > 5000) {
      throw new BadRequestException('concept must contain 1 to 5000 characters.');
    }
    parsed.concept = concept;
  }
  if (!partial || Object.hasOwn(value, 'objective')) {
    const objective = partial ? value.objective : (value.objective ?? 'grow_followers');
    if (
      typeof objective !== 'string' ||
      !CONTENT_OBJECTIVES.includes(objective as ContentObjective)
    ) {
      throw new BadRequestException('objective is not supported.');
    }
    parsed.objective = objective as ContentObjective;
  }

  return parsed as CreateContentIdea | UpdateContentIdea;
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
    return this.contentIdeas.create(parseFields(body, false) as CreateContentIdea);
  }

  @Patch(':id')
  updateDraft(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: unknown,
  ) {
    return this.contentIdeas.updateDraft(id, parseFields(body, true) as UpdateContentIdea);
  }
}
