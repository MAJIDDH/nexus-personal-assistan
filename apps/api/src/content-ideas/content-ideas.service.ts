import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export const CONTENT_OBJECTIVES = [
  'grow_followers',
  'increase_sales',
  'increase_engagement',
  'educate',
] as const;

export type ContentObjective = (typeof CONTENT_OBJECTIVES)[number];

export type ContentIdea = {
  id: string;
  title: string;
  concept: string;
  objective: ContentObjective;
  status: 'draft' | 'in_review' | 'approved' | 'archived';
  created_at: Date;
  updated_at: Date;
};

export type CreateContentIdea = {
  title: string;
  concept: string;
  objective: ContentObjective;
};

export type UpdateContentIdea = Partial<CreateContentIdea>;

@Injectable()
export class ContentIdeasService {
  constructor(private readonly database: DatabaseService) {}

  async list(userId: string): Promise<ContentIdea[]> {
    const result = await this.database.query<ContentIdea>(
      `SELECT id, title, concept, objective, status, created_at, updated_at
       FROM content_ideas WHERE user_id = $1
       ORDER BY created_at DESC, id DESC
       LIMIT $1`,
      [userId, 100],
    );
    return result.rows;
  }

  async create(userId: string, input: CreateContentIdea): Promise<ContentIdea> {
    const result = await this.database.query<ContentIdea>(
      `INSERT INTO content_ideas (user_id, title, concept, objective)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, concept, objective, status, created_at, updated_at`,
      [userId, input.title.trim(), input.concept.trim(), input.objective],
    );
    return result.rows[0];
  }

  async submitForReview(userId: string, id: string): Promise<ContentIdea> {
    const result = await this.database.query<ContentIdea>(
      `UPDATE content_ideas
       SET status = 'in_review', updated_at = now()
       WHERE id = $1 AND user_id = $2 AND status = 'draft'
       RETURNING id, title, concept, objective, status, created_at, updated_at`,
      [id, userId],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Draft content idea not found.');
    }
    return result.rows[0];
  }

  async updateDraft(userId: string, id: string, input: UpdateContentIdea): Promise<ContentIdea> {
    const result = await this.database.query<ContentIdea>(
      `UPDATE content_ideas
       SET title = COALESCE($2, title),
           concept = COALESCE($3, concept),
           objective = COALESCE($4, objective),
           updated_at = now()
       WHERE id = $1 AND user_id = $5 AND status = 'draft'
       RETURNING id, title, concept, objective, status, created_at, updated_at`,
      [id, input.title ?? null, input.concept ?? null, input.objective ?? null, userId],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Draft content idea not found.');
    }
    return result.rows[0];
  }
}
