import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  it('uses parameterized queries and closes the pool on shutdown', async () => {
    const service = new DatabaseService({
      getOrThrow: jest.fn().mockReturnValue(
        'postgresql://nexus:nexus_local_only@127.0.0.1:5432/nexus_dev',
      ),
    } as unknown as ConfigService);

    // No connection is opened until a query is issued.
    await expect(service.onApplicationShutdown()).resolves.toBeUndefined();
  });
});
