import { BadRequestException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController input validation', () => {
  const create = jest.fn();
  const update = jest.fn();
  const transition = jest.fn();
  let controller: TasksController;

  beforeEach(() => {
    create.mockReset().mockResolvedValue({ id: 'task-id' });
    update.mockReset().mockResolvedValue({ id: 'task-id' });
    transition.mockReset().mockResolvedValue({ id: 'task-id' });
    controller = new TasksController({ create, update, transition } as unknown as TasksService);
  });

  it('normalizes valid create input and applies safe defaults', () => {
    controller.create({ title: '  Call supplier  ', project_key: 'golddyousefi' });
    expect(create).toHaveBeenCalledWith({
      title: 'Call supplier',
      description: '',
      project_key: 'golddyousefi',
      importance: 3,
      urgency: 3,
      due_at: null,
    });
  });

  it.each([
    ['non-object body', null],
    ['empty title', { title: '   ' }],
    ['unsupported project', { title: 'Call supplier', project_key: 'unknown' }],
    ['out-of-range importance', { title: 'Call supplier', importance: 6 }],
    ['invalid deadline', { title: 'Call supplier', due_at: 'not-a-date' }],
    ['unexpected field', { title: 'Call supplier', admin: true }],
  ])('rejects %s before calling the service', (_caseName, body) => {
    expect(() => controller.create(body)).toThrow(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects empty partial updates and status payloads with extra fields', () => {
    expect(() => controller.update('00000000-0000-4000-8000-000000000001', {})).toThrow(BadRequestException);
    expect(() => controller.transition('00000000-0000-4000-8000-000000000001', { status: 'completed', force: true })).toThrow(BadRequestException);
    expect(update).not.toHaveBeenCalled();
    expect(transition).not.toHaveBeenCalled();
  });

  it('accepts only known status values', () => {
    expect(() => controller.transition('00000000-0000-4000-8000-000000000001', { status: 'deleted' })).toThrow(BadRequestException);
    expect(transition).not.toHaveBeenCalled();
  });
});
