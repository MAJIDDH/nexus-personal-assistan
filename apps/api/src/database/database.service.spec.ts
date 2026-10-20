const mockQuery = jest.fn();
const mockEnd = jest.fn().mockResolvedValue(undefined);
const mockPool = jest.fn().mockImplementation(() => ({
  query: mockQuery,
  end: mockEnd,
}));

jest.mock('pg', () => ({
  Pool: mockPool,
}));

import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  const databaseUrl =
    'postgresql://nexus:nexus_local_only@127.0.0.1:5432/nexus_dev';
  let service: DatabaseService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReset();
    mockEnd.mockReset().mockResolvedValue(undefined);
    mockPool.mockClear();
    service = new DatabaseService({
      getOrThrow: jest.fn().mockReturnValue(databaseUrl),
    } as unknown as ConfigService);
  });

  it('configures a bounded local pool without connecting eagerly', () => {
    expect(mockPool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: databaseUrl,
        max: 5,
        connectionTimeoutMillis: 3000,
        idleTimeoutMillis: 10000,
        application_name: 'nexus-local-prototype',
      }),
    );
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('forwards SQL and values separately for parameterized queries', async () => {
    const result = { rows: [{ id: 'fixture-1' }], rowCount: 1 };
    mockQuery.mockResolvedValue(result);

    await expect(
      service.query('SELECT id FROM demo_items WHERE id = $1', ['fixture-1']),
    ).resolves.toBe(result);

    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT id FROM demo_items WHERE id = $1',
      ['fixture-1'],
    );
  });

  it('reports healthy when SELECT 1 succeeds', async () => {
    mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 });
    await expect(service.ping()).resolves.toBe(true);
    expect(mockQuery).toHaveBeenCalledWith('SELECT 1');
  });

  it('reports unhealthy without leaking driver errors', async () => {
    mockQuery.mockRejectedValue(new Error('private connection detail'));
    await expect(service.ping()).resolves.toBe(false);
  });

  it('closes the pool on application shutdown', async () => {
    await expect(service.onApplicationShutdown()).resolves.toBeUndefined();
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
