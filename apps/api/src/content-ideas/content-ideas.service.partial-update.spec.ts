import { DatabaseService } from '../database/database.service';
import { ContentIdeasService } from './content-ideas.service';

describe('ContentIdeasService partial update contract', () => {
  const query = jest.fn();
  let service: ContentIdeasService;

  beforeEach(() => {
    query.mockReset();
    service = new ContentIdeasService({ query } as unknown as DatabaseService);
  });

  it('preserves omitted draft fields by passing null for absent values', async () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Updated title',
      concept: 'Original concept remains',
      objective: 'grow_followers',
      status: 'draft',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
      updated_at: new Date('2026-10-20T00:05:00.000Z'),
    };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });

    await expect(service.updateDraft(row.id, { title: 'Updated title' })).resolves.toEqual(row);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('title = COALESCE($2, title)'),
      [row.id, 'Updated title', null, null],
    );
  });

  it('propagates database errors from listing', async () => {
    const error = new Error('database unavailable');
    query.mockRejectedValue(error);

    await expect(service.list()).rejects.toBe(error);
  });

  it('propagates database errors from draft updates', async () => {
    const error = new Error('write failed');
    query.mockRejectedValue(error);

    await expect(service.updateDraft(
      '00000000-0000-4000-8000-000000000002',
      { concept: 'A safe synthetic edit' },
    )).rejects.toBe(error);
  });
});
