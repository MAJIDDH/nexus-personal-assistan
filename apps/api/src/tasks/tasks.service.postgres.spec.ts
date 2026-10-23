import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TasksService } from './tasks.service';

const integrationEnabled = Boolean(process.env.DATABASE_URL);

(integrationEnabled ? describe : describe.skip)('TasksService PostgreSQL concurrency integration', () => {
  let database: DatabaseService;
  let service: TasksService;
  const createdIds: string[] = [];

  beforeAll(() => {
    database = new DatabaseService({
      getOrThrow: (key: string) => {
        if (key !== 'DATABASE_URL' || !process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL is required for this integration test');
        }
        return process.env.DATABASE_URL;
      },
    } as unknown as ConfigService);
    service = new TasksService(database);
  });

  afterEach(async () => {
    for (const id of createdIds.splice(0)) {
      await database.query('DELETE FROM tasks WHERE id = $1', [id]);
    }
  });

  afterAll(async () => {
    if (database) await database.onApplicationShutdown();
  });

  it('allows only one of two competing terminal transitions and records one status change', async () => {
    const task = await service.create({
      title: `CI concurrent transition ${Date.now()} ${Math.random().toString(16).slice(2)}`,
      description: 'Synthetic integration test; safe to delete',
      project_key: 'golddyousefi',
      importance: 3,
      urgency: 3,
      due_at: null,
    });
    createdIds.push(task.id);

    let statusReads = 0;
    let releaseReads!: () => void;
    const bothReadStatus = new Promise<void>((resolve) => {
      releaseReads = resolve;
    });
    const synchronizedDatabase = {
      query: async <T extends import('pg').QueryResultRow = import('pg').QueryResultRow>(
        sql: string,
        values: unknown[] = [],
      ) => {
        if (sql.trim() === 'SELECT status FROM tasks WHERE id = $1') {
          statusReads += 1;
          if (statusReads === 2) releaseReads();
          await bothReadStatus;
        }
        return database.query<T>(sql, values);
      },
    } as unknown as DatabaseService;
    const concurrentService = new TasksService(synchronizedDatabase);

    const results = await Promise.allSettled([
      concurrentService.transition(task.id, 'completed'),
      concurrentService.transition(task.id, 'cancelled'),
    ]);
    const successes = results.filter((result) => result.status === 'fulfilled');
    const failures = results.filter((result) => result.status === 'rejected');

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    if (failures[0]?.status === 'rejected') {
      expect(failures[0].reason).toBeInstanceOf(BadRequestException);
      expect(failures[0].reason.message).toContain('Task changed concurrently');
    }

    const finalTask = await database.query<{ status: string; completed_at: Date | null }>(
      'SELECT status, completed_at FROM tasks WHERE id = $1',
      [task.id],
    );
    expect(['completed', 'cancelled']).toContain(finalTask.rows[0]?.status);
    expect(finalTask.rows[0]?.completed_at !== null).toBe(finalTask.rows[0]?.status === 'completed');

    const audit = await database.query<{ action: string }>(
      "SELECT action FROM audit_events WHERE entity_type = 'task' AND entity_id = $1 AND action = 'status_changed'",
      [task.id],
    );
    expect(audit.rows).toHaveLength(1);
  }, 15000);
});
