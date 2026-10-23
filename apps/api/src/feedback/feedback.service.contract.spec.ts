import { DatabaseService } from '../database/database.service';
import { FeedbackService } from './feedback.service';

describe('FeedbackService query contract', () => {
  const query = jest.fn();
  let service: FeedbackService;

  beforeEach(() => {
    query.mockReset();
    service = new FeedbackService({ query } as unknown as DatabaseService);
  });

  it('lists feedback with optional task filter and bounded caller-supplied limit', async () => {
    const rows = [{
      id: '00000000-0000-4000-8000-000000000001',
      task_id: '00000000-0000-4000-8000-000000000002',
      rating: 'useful',
      note: 'Synthetic feedback',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
    }];
    query.mockResolvedValue({ rows, rowCount: 1 });

    await expect(service.list()).resolves.toEqual(rows);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE ($1::uuid IS NULL OR task_id = $1)'),
      [null, 50],
    );
    expect(query.mock.calls[0][0]).toContain('ORDER BY created_at DESC, id DESC LIMIT $2');

    query.mockClear();
    await expect(service.list(rows[0].task_id, 25)).resolves.toEqual(rows);
    expect(query).toHaveBeenCalledWith(
      expect.any(String),
      [rows[0].task_id, 25],
    );
  });

  it('inserts feedback through a task existence check with parameterized values', async () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000003',
      task_id: '00000000-0000-4000-8000-000000000002',
      rating: 'needs_adjustment',
      note: 'Please adjust this',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
    };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });

    await expect(service.create({
      task_id: row.task_id,
      rating: 'needs_adjustment',
      note: '  Please adjust this  ',
    })).resolves.toEqual(row);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id, $2, $3 FROM tasks WHERE id = $1'),
      [row.task_id, 'needs_adjustment', 'Please adjust this'],
    );
  });

  it('reports a missing task when feedback insert returns no row', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });

    await expect(service.create({
      task_id: '00000000-0000-4000-8000-000000000004',
      rating: 'useful',
      note: '',
    })).rejects.toThrow('Task not found.');
  });

  it('propagates database errors without disguising them', async () => {
    const error = new Error('database unavailable');
    query.mockRejectedValue(error);

    await expect(service.list()).rejects.toBe(error);
  });
});
