import { BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TasksService } from './tasks.service';

describe('TasksService transition concurrency', () => {
  it('uses a compare-and-set update and rejects a concurrent status change', async () => {
    const query = jest.fn()
      .mockResolvedValueOnce({ rows: [{ status: 'open' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const service = new TasksService({ query } as unknown as DatabaseService);

    await expect(service.transition('task-1', 'completed')).rejects.toBeInstanceOf(BadRequestException);
    expect(query).toHaveBeenNthCalledWith(1, 'SELECT status FROM tasks WHERE id = $1', ['task-1']);
    expect(query.mock.calls[1][0]).toContain('WHERE id = $1 AND status = $3 RETURNING');
    expect(query.mock.calls[1][1]).toEqual(['task-1', 'completed', 'open']);
  });

  it('does not issue an update when the current status is already terminal', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [{ status: 'completed' }], rowCount: 1 });
    const service = new TasksService({ query } as unknown as DatabaseService);

    await expect(service.transition('task-1', 'open')).rejects.toBeInstanceOf(BadRequestException);
    expect(query).toHaveBeenCalledTimes(1);
  });
});
