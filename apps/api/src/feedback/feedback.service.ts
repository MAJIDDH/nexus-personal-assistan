import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export const FEEDBACK_RATINGS = ['useful', 'not_useful', 'needs_adjustment'] as const;
export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];
export type FeedbackRecord = { id: string; task_id: string; rating: FeedbackRating; note: string; created_at: Date };
export type CreateFeedbackInput = { task_id: string; rating: FeedbackRating; note: string };

@Injectable()
export class FeedbackService {
  constructor(private readonly database: DatabaseService) {}

  async list(userId: string, taskId?: string, limit = 50): Promise<FeedbackRecord[]> {
    const result = await this.database.query<FeedbackRecord>(
      `SELECT id, task_id, rating, note, created_at FROM task_feedback f JOIN tasks t ON t.id = f.task_id AND t.user_id = $1
       WHERE ($2::uuid IS NULL OR f.task_id = $2)
       ORDER BY f.created_at DESC, f.id DESC LIMIT $3`,
      [userId, taskId ?? null, limit],
    );
    return result.rows;
  }

  async create(userId: string, input: CreateFeedbackInput): Promise<FeedbackRecord> {
    const result = await this.database.query<FeedbackRecord>(
      `INSERT INTO task_feedback (task_id, rating, note)
       SELECT id, $3, $4 FROM tasks WHERE id = $1 AND user_id = $2
       RETURNING id, task_id, rating, note, created_at`,
      [input.task_id, userId, input.rating, input.note.trim()],
    );
    if (!result.rows[0]) throw new NotFoundException('Task not found.');
    return result.rows[0];
  }
}
