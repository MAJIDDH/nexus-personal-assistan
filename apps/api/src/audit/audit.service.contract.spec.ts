import { DatabaseService } from '../database/database.service';
import { AuditEvent, AuditService } from './audit.service';

describe('AuditService query contract', () => {
  it('uses null parameters when optional filters are omitted', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const service = new AuditService({ query } as unknown as DatabaseService);

    await service.list();

    expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE ($1::text IS NULL'), [null, null, 50]);
  });

  it('returns database rows without changing the event data', async () => {
    const events = [{
      id: 'event-1',
      entity_type: 'task',
      entity_id: '00000000-0000-4000-8000-000000000001',
      action: 'task.created',
      actor: 'nexus',
      source: 'api',
      before_data: null,
      after_data: { title: 'Fixture task' },
      occurred_at: new Date('2026-01-01T00:00:00.000Z'),
    }] as AuditEvent[];
    const query = jest.fn().mockResolvedValue({ rows: events, rowCount: 1 });
    const service = new AuditService({ query } as unknown as DatabaseService);

    await expect(service.list('task', events[0].entity_id, 1)).resolves.toBe(events);
  });

  it('propagates database errors instead of returning a misleading empty audit trail', async () => {
    const databaseError = new Error('database unavailable');
    const query = jest.fn().mockRejectedValue(databaseError);
    const service = new AuditService({ query } as unknown as DatabaseService);

    await expect(service.list()).rejects.toBe(databaseError);
  });
});
