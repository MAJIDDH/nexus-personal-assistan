import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { ContentIdeasService } from '../src/content-ideas/content-ideas.service';

describe('NEXUS API (e2e)', () => {
  let app: INestApplication;
  const database = { ping: jest.fn() };
  const ideas = {
    list: jest.fn(),
    create: jest.fn(),
    updateDraft: jest.fn(),
    submitForReview: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(database)
      .overrideProvider(ContentIdeasService)
      .useValue(ideas)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  beforeEach(() => {
    database.ping.mockReset();
    ideas.list.mockReset();
    ideas.create.mockReset();
    ideas.updateDraft.mockReset();
    ideas.submitForReview.mockReset();
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
        status: 'not_ready',
        service: 'nexus-api',
        dependencies: { database: 'unavailable' },
      });
  });

  it('/api/content-ideas (GET) returns stored ideas', () => {
    const fixture = [{
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Three necklace styles',
      concept: 'Compare three synthetic product concepts.',
      objective: 'grow_followers',
      status: 'draft',
    }];
    ideas.list.mockResolvedValue(fixture);
    return request(app.getHttpServer())
      .get('/api/content-ideas')
      .expect(200)
      .expect(fixture);
  });

  it('/api/content-ideas (POST) creates a valid draft idea', () => {
    const fixture = {
      id: '00000000-0000-4000-8000-000000000002',
      title: 'Choose your style',
      concept: 'Show three synthetic necklace concepts and ask viewers to choose.',
      objective: 'grow_followers',
      status: 'draft',
    };
    ideas.create.mockResolvedValue(fixture);
    return request(app.getHttpServer())
      .post('/api/content-ideas')
      .send({
        title: ' Choose your style ',
        concept: ' Show three synthetic necklace concepts and ask viewers to choose. ',
      })
      .expect(201)
      .expect(fixture)
      .then(() => {
        expect(ideas.create).toHaveBeenCalledWith({
          title: 'Choose your style',
          concept: 'Show three synthetic necklace concepts and ask viewers to choose.',
          objective: 'grow_followers',
        });
      });
  });

  it('/api/content-ideas/:id/submit-for-review moves a draft to review', () => {
    const id = '00000000-0000-4000-8000-000000000005';
    const fixture = {
      id,
      title: 'Review this idea',
      concept: 'Synthetic review concept',
      objective: 'grow_followers',
      status: 'in_review',
    };
    ideas.submitForReview.mockResolvedValue(fixture);
    return request(app.getHttpServer())
      .post(`/api/content-ideas/${id}/submit-for-review`)
      .expect(201)
      .expect(fixture)
      .then(() => {
        expect(ideas.submitForReview).toHaveBeenCalledWith(id);
      });
  });

  it('/api/content-ideas/:id/submit-for-review rejects invalid UUIDs', () => {
    return request(app.getHttpServer())
      .post('/api/content-ideas/not-a-uuid/submit-for-review')
      .expect(400);
  });

  it('/api/content-ideas (PATCH) updates a draft by UUID', () => {
    const id = '00000000-0000-4000-8000-000000000003';
    const fixture = {
      id,
      title: 'Updated title',
      concept: 'Updated concept',
      objective: 'educate',
      status: 'draft',
    };
    ideas.updateDraft.mockResolvedValue(fixture);
    return request(app.getHttpServer())
      .patch(`/api/content-ideas/${id}`)
      .send({ title: ' Updated title ', objective: 'educate' })
      .expect(200)
      .expect(fixture)
      .then(() => {
        expect(ideas.updateDraft).toHaveBeenCalledWith(id, {
          title: 'Updated title',
          objective: 'educate',
        });
      });
  });

  it('/api/content-ideas (PATCH) rejects invalid IDs and unsupported fields', async () => {
    await request(app.getHttpServer())
      .patch('/api/content-ideas/not-a-uuid')
      .send({ title: 'Draft' })
      .expect(400);

    await request(app.getHttpServer())
      .patch('/api/content-ideas/00000000-0000-4000-8000-000000000003')
      .send({ status: 'approved' })
      .expect(400);
  });

  it('/api/content-ideas (POST) rejects unsupported fields', () => {
    return request(app.getHttpServer())
      .post('/api/content-ideas')
      .send({
        title: 'Draft',
        concept: 'Synthetic test concept',
        publishNow: true,
      })
      .expect(400);
  });

  it('/api/content-ideas (POST) rejects invalid objectives', () => {
    return request(app.getHttpServer())
      .post('/api/content-ideas')
      .send({
        title: 'Draft',
        concept: 'Synthetic test concept',
        objective: 'publish_to_instagram',
      })
      .expect(400);
  });
});
