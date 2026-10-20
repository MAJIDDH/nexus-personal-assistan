import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { TASK_PROJECTS, TASK_STATUSES, CreateTaskInput, TaskProject, TaskStatus, TasksService, UpdateTaskInput } from './tasks.service';

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new BadRequestException('Request body must be a JSON object.');
  }
  return value as Record<string, unknown>;
}
function parseInput(value: unknown, partial: boolean): CreateTaskInput | UpdateTaskInput {
  const body = record(value);
  const allowed = new Set(['title','description','project_key','importance','urgency','due_at']);
  if (Object.keys(body).some((key) => !allowed.has(key))) throw new BadRequestException('Request contains unsupported fields.');
  if (partial && Object.keys(body).length === 0) throw new BadRequestException('At least one editable field is required.');
  const out: UpdateTaskInput = {};
  if (!partial || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim().length < 1 || body.title.trim().length > 200) throw new BadRequestException('title must contain 1 to 200 characters.');
    out.title = body.title.trim();
  }
  if (!partial || Object.hasOwn(body, 'description')) {
    const description = partial ? body.description : (body.description ?? '');
    if (typeof description !== 'string' || description.length > 5000) throw new BadRequestException('description must be a string of at most 5000 characters.');
    out.description = description.trim();
  }
  if (!partial || Object.hasOwn(body, 'project_key')) {
    const project = partial ? body.project_key : (body.project_key ?? 'personal');
    if (typeof project !== 'string' || !TASK_PROJECTS.includes(project as TaskProject)) throw new BadRequestException('project_key is not supported.');
    out.project_key = project as TaskProject;
  }
  for (const field of ['importance','urgency'] as const) {
    if (!partial || Object.hasOwn(body, field)) {
      const n = partial ? body[field] : (body[field] ?? 3);
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > 5) throw new BadRequestException(field + ' must be an integer from 1 to 5.');
      out[field] = n;
    }
  }
  if (!partial || Object.hasOwn(body, 'due_at')) {
    const due = partial ? body.due_at : (body.due_at ?? null);
    if (due !== null && (typeof due !== 'string' || !Number.isFinite(Date.parse(due)))) throw new BadRequestException('due_at must be a valid ISO date string or null.');
    out.due_at = due as string | null;
  }
  return out as CreateTaskInput | UpdateTaskInput;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get()
  list(@Query('project') project?: string, @Query('status') status?: string) {
    return this.tasks.list(project, status);
  }
  @Post()
  create(@Body() body: unknown) {
    return this.tasks.create(parseInput(body, false) as CreateTaskInput);
  }
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: unknown) {
    return this.tasks.update(id, parseInput(body, true) as UpdateTaskInput);
  }
  @Post(':id/status')
  transition(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: unknown) {
    const input = record(body);
    if (Object.keys(input).length !== 1 || typeof input.status !== 'string' || !TASK_STATUSES.includes(input.status as TaskStatus)) {
      throw new BadRequestException('Provide only a supported status field.');
    }
    return this.tasks.transition(id, input.status as TaskStatus);
  }
}
