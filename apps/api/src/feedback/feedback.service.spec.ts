import { DatabaseService } from '../database/database.service';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  it('creates feedback with parameterized values', async () => {
    const row = { id: 'feedback-1', task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful', note: 'Clear', created_at: new Date() };
    const query = jest.fn().mockResolvedValue({ rows: [row], rowCount: 1 });
    const service = new FeedbackService({ query } as unknown as DatabaseService);
    await expect(service.create({ task_id: row.task_id, rating: 'useful', note: 'Clear' })).resolves.toEqual(row);
    expect(query.mock.calls[0][1]).toEqual([row.task_id, 'useful', 'Clear']);
    expect(query.mock.calls[0][0]).toContain('SELECT id, $2, $3 FROM tasks WHERE id = $1');
  });

  it('rejects feedback for a missing task', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const service = new FeedbackService({ query } as unknown as DatabaseService);
    await expect(service.create({ task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful', note: '' })).rejects.toThrow('Task not found.');
  });

  it('bounds retrieval and parameterizes task filters', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const service = new FeedbackService({ query } as unknown as DatabaseService);
    await service.list('00000000-0000-4000-8000-000000000001', 10);
    expect(query.mock.calls[0][1]).toEqual(['00000000-0000-4000-8000-000000000001', 10]);
  });
});
