import { DatabaseService } from '../database/database.service';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('lists newest events using parameterized filters and a bounded limit', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const service = new AuditService({ query } as unknown as DatabaseService);
    await service.list('owner-id', 'task', '00000000-0000-4000-8000-000000000001', 25);
    expect(query.mock.calls[0][0]).toContain('ORDER BY e.occurred_at DESC, e.id DESC');
    expect(query.mock.calls[0][1]).toEqual(['owner-id', 'task', '00000000-0000-4000-8000-000000000001', 25]);
  });
});
