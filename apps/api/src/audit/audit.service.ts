import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export type AuditEvent = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor: string;
  source: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown>;
  occurred_at: Date;
};

@Injectable()
export class AuditService {
  constructor(private readonly database: DatabaseService) {}

  async list(entityType?: string, entityId?: string, limit = 50): Promise<AuditEvent[]> {
    const result = await this.database.query<AuditEvent>(
      `SELECT id, entity_type, entity_id, action, actor, source, before_data, after_data, occurred_at
       FROM audit_events
       WHERE ($1::text IS NULL OR entity_type = $1)
         AND ($2::uuid IS NULL OR entity_id = $2)
       ORDER BY occurred_at DESC, id DESC
       LIMIT $3`,
      [entityType ?? null, entityId ?? null, limit],
    );
    return result.rows;
  }
}
