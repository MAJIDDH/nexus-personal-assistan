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

  async list(userId: string, entityType?: string, entityId?: string, limit = 50): Promise<AuditEvent[]> {
    const result = await this.database.query<AuditEvent>(
      `SELECT id, entity_type, entity_id, action, actor, source, before_data, after_data, occurred_at
       FROM audit_events e JOIN tasks t ON t.id = e.entity_id AND t.user_id = $1
       WHERE e.user_id = $1 AND ($2::text IS NULL OR e.entity_type = $2)
         AND ($3::uuid IS NULL OR e.entity_id = $3)
       ORDER BY e.occurred_at DESC, e.id DESC
       LIMIT $4`,
      [userId, entityType ?? null, entityId ?? null, limit],
    );
    return result.rows;
  }
}
