import { BadRequestException } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController validation', () => {
  const list = jest.fn();
  let controller: AuditController;

  beforeEach(() => {
    list.mockReset().mockResolvedValue([]);
    controller = new AuditController({ list } as unknown as AuditService);
  });

  it('applies the default limit and forwards valid filters', () => {
    controller.list();
    expect(list).toHaveBeenLastCalledWith(undefined, undefined, 50);
    controller.list('task', '00000000-0000-4000-8000-000000000001', '200');
    expect(list).toHaveBeenLastCalledWith('task', '00000000-0000-4000-8000-000000000001', 200);
  });

  it.each(['0', '-1', '201', '1.2', 'abc', ''])('rejects invalid limit %p', (limit) => {
    expect(() => controller.list(undefined, undefined, limit)).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });

  it('rejects unsupported entity types and malformed IDs', () => {
    expect(() => controller.list('user')).toThrow(BadRequestException);
    expect(() => controller.list('task', 'invalid')).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });
});
