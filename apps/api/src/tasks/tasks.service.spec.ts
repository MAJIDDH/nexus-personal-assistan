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
  it('rejects transitions from terminal states', async () => {
    query.mockResolvedValueOnce({ rows: [{ status: 'completed' }], rowCount: 1 });
    await expect(service.transition('id', 'open')).rejects.toBeInstanceOf(BadRequestException);
  });
  it('returns not found for missing task transitions', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });
    await expect(service.transition('missing', 'completed')).rejects.toBeInstanceOf(NotFoundException);
  });
});
