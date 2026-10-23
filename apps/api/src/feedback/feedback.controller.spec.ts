import { BadRequestException } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController validation', () => {
  const list = jest.fn();
  const create = jest.fn();
  let controller: FeedbackController;

  beforeEach(() => {
    list.mockReset().mockResolvedValue([]);
    create.mockReset().mockResolvedValue({ id: 'feedback-id' });
    controller = new FeedbackController({ list, create } as unknown as FeedbackService);
  });

  it('uses a default list limit and accepts valid filters', () => {
    controller.list();
    expect(list).toHaveBeenLastCalledWith(undefined, 50);
    controller.list('00000000-0000-4000-8000-000000000001', '200');
    expect(list).toHaveBeenLastCalledWith('00000000-0000-4000-8000-000000000001', 200);
  });

  it.each(['0', '-1', '201', '2.5', 'abc', ''])('rejects invalid list limit %p', (limit) => {
    expect(() => controller.list(undefined, limit)).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });

  it('rejects malformed task IDs in list queries', () => {
    expect(() => controller.list('not-a-uuid')).toThrow(BadRequestException);
    expect(list).not.toHaveBeenCalled();
  });

  it('normalizes omitted note and passes valid feedback', () => {
    controller.create({ task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful' });
    expect(create).toHaveBeenCalledWith({
      task_id: '00000000-0000-4000-8000-000000000001',
      rating: 'useful',
      note: '',
    });
  });

  it.each([
    ['non-object body', null],
    ['invalid task ID', { task_id: 'bad', rating: 'useful' }],
    ['invalid rating', { task_id: '00000000-0000-4000-8000-000000000001', rating: 'great' }],
    ['non-string note', { task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful', note: 4 }],
    ['oversized note', { task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful', note: 'x'.repeat(2001) }],
    ['unsupported field', { task_id: '00000000-0000-4000-8000-000000000001', rating: 'useful', admin: true }],
  ])('rejects %s before calling the service', (_caseName, body) => {
    expect(() => controller.create(body)).toThrow(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });
});
