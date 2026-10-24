import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthenticatedUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FEEDBACK_RATINGS, FeedbackService, FeedbackRating } from './feedback.service';

function objectBody(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new BadRequestException('Request body must be a JSON object.');
  }
  return value as Record<string, unknown>;
}

@UseGuards(AuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query('task_id') taskId?: string, @Query('limit') limit?: string) {
    if (taskId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(taskId)) {
      throw new BadRequestException('task_id must be a UUID.');
    }
    const parsedLimit = limit === undefined ? 50 : Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 200) {
      throw new BadRequestException('limit must be an integer from 1 to 200.');
    }
    return this.feedback.list(user.id, taskId, parsedLimit);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() value: unknown) {
    const body = objectBody(value);
    if (Object.keys(body).some((key) => !['task_id', 'rating', 'note'].includes(key))) {
      throw new BadRequestException('Request contains unsupported fields.');
    }
    if (typeof body.task_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.task_id)) {
      throw new BadRequestException('task_id must be a UUID.');
    }
    if (typeof body.rating !== 'string' || !FEEDBACK_RATINGS.includes(body.rating as FeedbackRating)) {
      throw new BadRequestException('rating must be useful, not_useful, or needs_adjustment.');
    }
    const note = body.note ?? '';
    if (typeof note !== 'string' || note.length > 2000) {
      throw new BadRequestException('note must be a string of at most 2000 characters.');
    }
    return this.feedback.create(user.id, { task_id: body.task_id, rating: body.rating as FeedbackRating, note });
  }
}
