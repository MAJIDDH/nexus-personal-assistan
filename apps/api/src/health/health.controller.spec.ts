import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const database = { ping: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function createController(): Promise<HealthController> {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DatabaseService, useValue: database }],
    }).compile();
    return moduleRef.get(HealthController);
  }

  it('returns a minimal non-sensitive liveness status', async () => {
    const controller = await createController();

    expect(controller.getHealth()).toEqual({
      status: 'ok',
      service: 'nexus-api',
    });
  });

  it('reports ready when the database responds', async () => {
    database.ping.mockResolvedValue(true);
    const controller = await createController();

    await expect(controller.getReadiness()).resolves.toEqual({
      status: 'ready',
      service: 'nexus-api',
      dependencies: { database: 'ok' },
    });
  });

  it('returns service unavailable when the database does not respond', async () => {
    database.ping.mockResolvedValue(false);
    const controller = await createController();

    await expect(controller.getReadiness()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
