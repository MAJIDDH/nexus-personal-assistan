import { DatabaseService } from '../database/database.service';
import { ContentIdeasService } from './content-ideas.service';

describe('ContentIdeasService', () => {
  const query = jest.fn();
  let service: ContentIdeasService;

  beforeEach(() => {
    query.mockReset();
    service = new ContentIdeasService({
      query,
    } as unknown as DatabaseService);
  });

  it('lists a bounded newest-first collection without interpolating values', async () => {
    const rows = [{
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Synthetic idea',
      concept: 'Synthetic concept',
      objective: 'grow_followers',
      status: 'draft',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
      updated_at: new Date('2026-10-20T00:00:00.000Z'),
    }];
    query.mockResolvedValue({ rows, rowCount: 1 });

    await expect(service.list()).resolves.toEqual(rows);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY created_at DESC, id DESC'),
      [100],
    );
    expect(query.mock.calls[0][0]).toContain('LIMIT $1');
  });

  it('inserts trimmed fields with parameterized values', async () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000002',
      title: 'Choose a style',
      concept: 'Compare three synthetic concepts.',
      objective: 'grow_followers',
      status: 'draft',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
      updated_at: new Date('2026-10-20T00:00:00.000Z'),
    };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });

    await expect(service.create({
      title: ' Choose a style ',
      concept: ' Compare three synthetic concepts. ',
      objective: 'grow_followers',
    })).resolves.toEqual(row);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('VALUES ($1, $2, $3)'),
      ['Choose a style', 'Compare three synthetic concepts.', 'grow_followers'],
    );
  });

  it('submits only drafts for review using a guarded status transition', async () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000005',
      title: 'Review this idea',
      concept: 'Synthetic review concept',
      objective: 'grow_followers',
      status: 'in_review',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
      updated_at: new Date('2026-10-20T00:05:00.000Z'),
    };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });

    await expect(service.submitForReview(row.id)).resolves.toEqual(row);
    expect(query.mock.calls[0][0]).toContain("SET status = 'in_review'");
    expect(query.mock.calls[0][0]).toContain("WHERE id = $1 AND status = 'draft'");
    expect(query.mock.calls[0][1]).toEqual([row.id]);
  });

  it('does not submit missing or non-draft ideas for review', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });
    await expect(service.submitForReview(
      '00000000-0000-4000-8000-000000000006',
    )).rejects.toThrow('Draft content idea not found.');
  });

  it('only updates drafts and passes all values as SQL parameters', async () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000003',
      title: 'Updated title',
      concept: 'Updated synthetic concept',
      objective: 'educate',
      status: 'draft',
      created_at: new Date('2026-10-20T00:00:00.000Z'),
      updated_at: new Date('2026-10-20T00:05:00.000Z'),
    };
    query.mockResolvedValue({ rows: [row], rowCount: 1 });

    await expect(service.updateDraft(row.id, {
      title: 'Updated title',
      concept: 'Updated synthetic concept',
      objective: 'educate',
    })).resolves.toEqual(row);

    expect(query.mock.calls[0][0]).toContain("WHERE id = $1 AND status = 'draft'");
    expect(query.mock.calls[0][0]).toContain('updated_at = now()');
    expect(query.mock.calls[0][1]).toEqual([
      row.id,
      'Updated title',
      'Updated synthetic concept',
      'educate',
    ]);
  });

  it('does not update missing or non-draft ideas', async () => {
    query.mockResolvedValue({ rows: [], rowCount: 0 });
    await expect(service.updateDraft(
      '00000000-0000-4000-8000-000000000004',
      { title: 'Attempted change' },
    )).rejects.toThrow('Draft content idea not found.');
  });
});
