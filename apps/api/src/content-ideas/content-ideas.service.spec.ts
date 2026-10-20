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
});
