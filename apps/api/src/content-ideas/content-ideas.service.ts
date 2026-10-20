import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ContentIdeasService {
  constructor(private readonly database: DatabaseService) {}

  async list(): Promise<ContentIdea[]> {
    const result = await this.database.query<ContentIdea>(
      `SELECT id, title, concept, objective, status, created_at, updated_at
       FROM content_ideas
       ORDER BY created_at DESC, id DESC
       LIMIT $1`,
      [100],
    );
    return result.rows;
  }

  async create(input: CreateContentIdea): Promise<ContentIdea> {
    const result = await this.database.query<ContentIdea>(
      `INSERT INTO content_ideas (title, concept, objective)
       VALUES ($1, $2, $3)
       RETURNING id, title, concept, objective, status, created_at, updated_at`,
      [input.title.trim(), input.concept.trim(), input.objective],
    );
    return result.rows[0];
  }
}
