import { BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('lists newest events using parameterized filters and a bounded limit', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const service = new AuditService({ query } as unknown as DatabaseService);
    await service.list('task', '00000000-0000-4000-8000-000000000001', 25);
    expect(query.mock.calls[0][0]).toContain('ORDER BY occurred_at DESC, id DESC');
    expect(query.mock.calls[0][1]).toEqual(['task', '00000000-0000-4000-8000-000000000001', 25]);
  });
});

describe('AuditController query validation', () => {
  const list = jest.fn();
  let controller: AuditController;

  beforeEach(() => {
    list.mockReset().mockResolvedValue([]);
    controller = new AuditController({ list } as unknown as AuditService);
  });

  it('uses a safe default limit and accepts the maximum limit', () => {
    controller.list();
    expect(list).toHaveBeenLastCalledWith(undefined, undefined, 50);
    controller.list('task', undefined, '200');
    expect(list).toHaveBeenLastCalledWith('task', undefined, 200);
  });

  it.each(['0', '-1', '201', '1.5', 'abc', ''])('rejects invalid limit %p', (limit) => {
    expect(() => controller.list(undefined, undefined, limit)).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });

  it('rejects unsupported entity types before querying', () => {
    expect(() => controller.list('user')).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });

  it('rejects malformed entity UUIDs before querying', () => {
    expect(() => controller.list('task', 'not-a-uuid')).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });
});
