import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const query = jest.fn();
  let service: TasksService;
  beforeEach(() => {
    query.mockReset();
    service = new TasksService({ query } as unknown as DatabaseService);
  });

  it('lists with validated filters and urgency-first ordering', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });
    await service.list('golddyousefi', 'open');
    expect(query.mock.calls[0][0]).toContain('priority_score DESC');
    expect(query.mock.calls[0][0]).toContain("status IN ('open','in_progress') AND due_at IS NOT NULL AND due_at <= now()");
    expect(query.mock.calls[0][1]).toEqual(['golddyousefi', 'open']);
  });

  it('rejects unsupported project filters before querying', async () => {
    await expect(service.list('other-project')).rejects.toBeInstanceOf(BadRequestException);
    expect(query).not.toHaveBeenCalled();
  });

  it('creates tasks with parameterized values', async () => {
    const row = { id: 'task-id', title: 'Prepare content', status: 'open' };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });
    await expect(service.create({
      title: ' Prepare content ', description: '', project_key: 'golddyousefi',
      importance: 5, urgency: 4, due_at: null,
    })).resolves.toEqual(row);
    expect(query.mock.calls[0][1]).toEqual(['Prepare content', '', 'golddyousefi', 5, 4, null]);
  });

  it('rejects transitions from terminal states without attempting an update', async () => {
    query.mockResolvedValueOnce({ rows: [{ status: 'completed' }], rowCount: 1 });
    await expect(service.transition('id', 'open')).rejects.toBeInstanceOf(BadRequestException);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('returns not found for missing task transitions', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });
    await expect(service.transition('missing', 'completed')).rejects.toBeInstanceOf(NotFoundException);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('rejects a concurrent change when the conditional update affects no row', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ status: 'open' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 });

    await expect(service.transition('task-id', 'completed')).rejects.toThrow(
      'Task changed concurrently; reload and retry.',
    );
    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[1][0]).toContain('WHERE id = $1 AND status = $3');
    expect(query.mock.calls[1][1]).toEqual(['task-id', 'completed', 'open']);
  });

  it('sets completed_at only for completion and clears it when leaving an active state', async () => {
    const completed = { id: 'task-id', status: 'completed', completed_at: new Date('2026-01-01T00:00:00Z') };
    query
      .mockResolvedValueOnce({ rows: [{ status: 'in_progress' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [completed], rowCount: 1 });

    await expect(service.transition('task-id', 'completed')).resolves.toEqual(completed);
    expect(query.mock.calls[1][0]).toContain("completed_at = CASE WHEN $2 = 'completed' THEN now() ELSE NULL END");
    expect(query.mock.calls[1][1]).toEqual(['task-id', 'completed', 'in_progress']);

    query.mockReset();
    query
      .mockResolvedValueOnce({ rows: [{ status: 'in_progress' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ id: 'task-id', status: 'cancelled', completed_at: null }], rowCount: 1 });

    await expect(service.transition('task-id', 'cancelled')).resolves.toMatchObject({
      status: 'cancelled',
      completed_at: null,
    });
    expect(query.mock.calls[1][1]).toEqual(['task-id', 'cancelled', 'in_progress']);
  });
});
