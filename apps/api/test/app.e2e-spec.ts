import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('NEXUS API (e2e)', () => {
  let app: INestApplication;
  const database = { ping: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(database)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  beforeEach(() => {
    database.ping.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api (GET) reports local prototype mode', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect({ name: 'NEXUS', mode: 'local-prototype' });
  });

  it('/api/health (GET) returns liveness without database access', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok', service: 'nexus-api' })
      .then(() => {
        expect(database.ping).not.toHaveBeenCalled();
      });
  });

  it('/api/health/ready (GET) reports ready when database responds', () => {
    database.ping.mockResolvedValue(true);
    return request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200)
      .expect({
        status: 'ready',
        service: 'nexus-api',
        dependencies: { database: 'ok' },
      });
  });

  it('/api/health/ready (GET) returns 503 when database is unavailable', () => {
    database.ping.mockResolvedValue(false);
    return request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(503)
      .expect({
        statusCode: 503,
        message: {
          status: 'not_ready',
          service: 'nexus-api',
          dependencies: { database: 'unavailable' },
        },
      });
  });
});
