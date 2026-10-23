import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export const TASK_PROJECTS = ['personal', 'nexus', 'golddyousefi', 'bache-mahal'] as const;
export type TaskProject = (typeof TASK_PROJECTS)[number];
export const TASK_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskRecord = {
  id: string; title: string; description: string; project_key: TaskProject;
  importance: number; urgency: number; due_at: Date | null; status: TaskStatus;
  priority_score: number; created_at: Date; updated_at: Date; completed_at: Date | null;
};
export type CreateTaskInput = {
  title: string; description: string; project_key: TaskProject;
  importance: number; urgency: number; due_at: string | null;
};
export type UpdateTaskInput = Partial<CreateTaskInput>;

const TASK_SELECT = `id, title, description, project_key, importance, urgency, due_at, status,
  (importance * 2 + urgency * 2 + CASE
    WHEN status IN ('open','in_progress') AND due_at IS NOT NULL AND due_at <= now() THEN 5
    WHEN status IN ('open','in_progress') AND due_at IS NOT NULL AND due_at <= now() + interval '24 hours' THEN 3
    ELSE 0 END) AS priority_score,
  created_at, updated_at, completed_at`;

@Injectable()
export class TasksService {
  constructor(private readonly database: DatabaseService) {}

  async list(project?: string, status?: string): Promise<TaskRecord[]> {
    if (project && !TASK_PROJECTS.includes(project as TaskProject)) {
      throw new BadRequestException('project is not supported.');
    }
    if (status && !TASK_STATUSES.includes(status as TaskStatus)) {
      throw new BadRequestException('status is not supported.');
    }
    const result = await this.database.query<TaskRecord>(
      `SELECT ${TASK_SELECT} FROM tasks
       WHERE ($1::text IS NULL OR project_key = $1)
         AND ($2::text IS NULL OR status = $2)
       ORDER BY
         CASE WHEN due_at IS NOT NULL AND due_at < now() AND status IN ('open','in_progress') THEN 0 ELSE 1 END,
         priority_score DESC, due_at ASC NULLS LAST, created_at DESC
       LIMIT 200`,
      [project ?? null, status ?? null],
    );
    return result.rows;
  }

  async create(input: CreateTaskInput): Promise<TaskRecord> {
    const result = await this.database.query<TaskRecord>(
      `INSERT INTO tasks (title, description, project_key, importance, urgency, due_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${TASK_SELECT}`,
      [input.title.trim(), input.description.trim(), input.project_key, input.importance, input.urgency, input.due_at],
    );
    return result.rows[0];
  }

  async update(id: string, input: UpdateTaskInput): Promise<TaskRecord> {
    const result = await this.database.query<TaskRecord>(
      `UPDATE tasks SET
       title = COALESCE($2, title), description = COALESCE($3, description),
       project_key = COALESCE($4, project_key), importance = COALESCE($5, importance),
       urgency = COALESCE($6, urgency), due_at = CASE WHEN $7::boolean THEN $8::timestamptz ELSE due_at END,
       updated_at = now()
       WHERE id = $1 AND status IN ('open','in_progress')
       RETURNING ${TASK_SELECT}`,
      [id, input.title ?? null, input.description ?? null, input.project_key ?? null,
       input.importance ?? null, input.urgency ?? null,
       Object.prototype.hasOwnProperty.call(input, 'due_at'), input.due_at ?? null],
    );
    if (!result.rows[0]) throw new NotFoundException('Editable task not found.');
    return result.rows[0];
  }

  async transition(id: string, status: TaskStatus): Promise<TaskRecord> {
    const allowed: Record<TaskStatus, TaskStatus[]> = {
      open: ['in_progress', 'completed', 'cancelled'],
      in_progress: ['open', 'completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    const current = await this.database.query<{ status: TaskStatus }>(
      'SELECT status FROM tasks WHERE id = $1', [id],
    );
    if (!current.rows[0]) throw new NotFoundException('Task not found.');
    if (!allowed[current.rows[0].status].includes(status)) {
      throw new BadRequestException('This task status transition is not allowed.');
    }
    const result = await this.database.query<TaskRecord>(
      `UPDATE tasks SET status = $2, updated_at = now(),
       completed_at = CASE WHEN $2 = 'completed' THEN now() ELSE NULL END
       WHERE id = $1 AND status = $3 RETURNING ${TASK_SELECT}`,
      [id, status, current.rows[0].status],
    );
    if (!result.rows[0]) throw new BadRequestException('Task changed concurrently; reload and retry.');
    return result.rows[0];
  }
}
