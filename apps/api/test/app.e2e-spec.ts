import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { ContentIdeasService } from '../src/content-ideas/content-ideas.service';
import { TasksService } from '../src/tasks/tasks.service';
import { AuditService } from '../src/audit/audit.service';
import { FeedbackService } from '../src/feedback/feedback.service';

describe('NEXUS API (e2e)', () => {
  let app: INestApplication;
  const database = { ping: jest.fn() };
  const audit = { list: jest.fn() };
  const feedback = { list: jest.fn(), create: jest.fn() };
  const tasks = { list: jest.fn(), create: jest.fn(), update: jest.fn(), transition: jest.fn() };
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
      .overrideProvider(TasksService)
      .useValue(tasks)
      .overrideProvider(AuditService)
      .useValue(audit)
      .overrideProvider(FeedbackService)
      .useValue(feedback)
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
    tasks.list.mockReset(); tasks.create.mockReset(); tasks.update.mockReset(); tasks.transition.mockReset();
    audit.list.mockReset();
    feedback.list.mockReset(); feedback.create.mockReset();
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

  it('/api/audit-events (GET) lists bounded task history', () => {
    const fixture = [{ id: '1', entity_type: 'task', action: 'created' }];
    audit.list.mockResolvedValue(fixture);
    return request(app.getHttpServer()).get('/api/audit-events?entity_type=task&limit=20')
      .expect(200).expect(fixture).then(() => expect(audit.list).toHaveBeenCalledWith('task', undefined, 20));
  });

  it('/api/audit-events (GET) rejects invalid limits and entity types', async () => {
    await request(app.getHttpServer()).get('/api/audit-events?limit=999').expect(400);
    await request(app.getHttpServer()).get('/api/audit-events?entity_type=customer').expect(400);
  });

  it('/api/feedback (GET) lists feedback with bounded filters', () => {
    const fixture = [{ id: 'fb-1', rating: 'useful', note: 'Good' }];
    feedback.list.mockResolvedValue(fixture);
    return request(app.getHttpServer()).get('/api/feedback?limit=15')
      .expect(200).expect(fixture).then(() => expect(feedback.list).toHaveBeenCalledWith(undefined, 15));
  });

  it('/api/feedback (POST) validates and records user feedback', async () => {
    const taskId = '00000000-0000-4000-8000-000000000021';
    const fixture = { id: 'fb-2', task_id: taskId, rating: 'useful', note: 'Helpful', created_at: '2026-10-20T10:00:00.000Z' };
    feedback.create.mockResolvedValue(fixture);
    await request(app.getHttpServer()).post('/api/feedback').send({ task_id: taskId, rating: 'useful', note: 'Helpful' }).expect(201).expect(fixture);
    expect(feedback.create).toHaveBeenCalledWith({ task_id: taskId, rating: 'useful', note: 'Helpful' });
    await request(app.getHttpServer()).post('/api/feedback').send({ task_id: taskId, rating: 'publish' }).expect(400);
    await request(app.getHttpServer()).post('/api/feedback').send({ task_id: taskId, rating: 'useful', admin: true }).expect(400);
  });

  it('/api/tasks (GET) lists tasks with optional project and status filters', () => {
    const fixture = [{ id: '00000000-0000-4000-8000-000000000009', title: 'Prepare content', status: 'open' }];
    tasks.list.mockResolvedValue(fixture);
    return request(app.getHttpServer()).get('/api/tasks?project=golddyousefi&status=open')
      .expect(200).expect(fixture).then(() => {
        expect(tasks.list).toHaveBeenCalledWith('golddyousefi', 'open');
      });
  });

  it('/api/tasks (POST) creates a task with safe defaults', () => {
    const fixture = { id: '00000000-0000-4000-8000-000000000010', title: 'Prepare content', description: '', project_key: 'personal', importance: 3, urgency: 3, due_at: null, status: 'open' };
    tasks.create.mockResolvedValue(fixture);
    return request(app.getHttpServer()).post('/api/tasks')
      .send({ title: ' Prepare content ' }).expect(201).expect(fixture)
      .then(() => expect(tasks.create).toHaveBeenCalledWith({
        title: 'Prepare content', description: '', project_key: 'personal',
        importance: 3, urgency: 3, due_at: null,
      }));
  });

  it('/api/tasks (POST) rejects unsupported fields and invalid priority', async () => {
    await request(app.getHttpServer()).post('/api/tasks').send({ title: 'Task', runNow: true }).expect(400);
    await request(app.getHttpServer()).post('/api/tasks').send({ title: 'Task', importance: 9 }).expect(400);
  });

  it('/api/tasks/:id/status transitions a task using an explicit status action', () => {
    const id = '00000000-0000-4000-8000-000000000011';
    const fixture = { id, title: 'Task', status: 'in_progress' };
    tasks.transition.mockResolvedValue(fixture);
    return request(app.getHttpServer()).post(`/api/tasks/${id}/status`)
      .send({ status: 'in_progress' }).expect(201).expect(fixture)
      .then(() => expect(tasks.transition).toHaveBeenCalledWith(id, 'in_progress'));
  });

  it('/api/tasks (GET) passes filters to the task service for validation', () => {
    return request(app.getHttpServer()).get('/api/tasks?status=publish').expect(200).then(() => {
      expect(tasks.list).toHaveBeenCalledWith(undefined, 'publish');
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
