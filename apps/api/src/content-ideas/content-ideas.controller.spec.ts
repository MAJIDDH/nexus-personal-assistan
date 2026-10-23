import { BadRequestException } from '@nestjs/common';
import { ContentIdeasController } from './content-ideas.controller';
import { ContentIdeasService } from './content-ideas.service';

describe('ContentIdeasController validation', () => {
  let controller: ContentIdeasController;
  let service: jest.Mocked<Pick<ContentIdeasService, 'create' | 'updateDraft' | 'submitForReview' | 'list'>>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      updateDraft: jest.fn(),
      submitForReview: jest.fn(),
      list: jest.fn(),
    };
    controller = new ContentIdeasController(service as unknown as ContentIdeasService);
  });

  it('trims title and concept and defaults objective on create', async () => {
    service.create.mockResolvedValue({} as never);
    await controller.create({ title: '  Necklace reel  ', concept: '  Show three styles  ' });
    expect(service.create).toHaveBeenCalledWith({
      title: 'Necklace reel',
      concept: 'Show three styles',
      objective: 'grow_followers',
    });
  });

  it('accepts a supported objective', async () => {
    service.create.mockResolvedValue({} as never);
    await controller.create({ title: 'Title', concept: 'Concept', objective: 'increase_sales' });
    expect(service.create).toHaveBeenCalledWith({
      title: 'Title',
      concept: 'Concept',
      objective: 'increase_sales',
    });
  });

  it.each([null, [], 'not an object', 4])('rejects a non-object create body: %p', async (body) => {
    await expect(Promise.resolve().then(() => controller.create(body))).rejects.toBeInstanceOf(BadRequestException);
    expect(service.create).not.toHaveBeenCalled();
  });

  it.each([
    {},
    { title: '   ', concept: 'Concept' },
    { title: 'x'.repeat(161), concept: 'Concept' },
    { title: 'Title', concept: '' },
    { title: 'Title', concept: 'x'.repeat(5001) },
    { title: 'Title', concept: 'Concept', objective: 'viral' },
    { title: 'Title', concept: 'Concept', extra: true },
  ])('rejects invalid create payload: %p', async (body) => {
    await expect(Promise.resolve().then(() => controller.create(body))).rejects.toBeInstanceOf(BadRequestException);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('trims fields in a partial draft update', async () => {
    service.updateDraft.mockResolvedValue({} as never);
    await controller.updateDraft('123e4567-e89b-12d3-a456-426614174000', { title: '  Updated  ' });
    expect(service.updateDraft).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      { title: 'Updated' },
    );
  });

  it.each([{}, null, [], { objective: 'unsupported' }, { concept: '  ' }, { extra: 'nope' }])(
    'rejects invalid partial update: %p',
    async (body) => {
      await expect(Promise.resolve().then(() =>
        controller.updateDraft('123e4567-e89b-12d3-a456-426614174000', body),
      )).rejects.toBeInstanceOf(BadRequestException);
      expect(service.updateDraft).not.toHaveBeenCalled();
    },
  );

  it('delegates list to the service', async () => {
    service.list.mockResolvedValue([] as never);
    await expect(controller.list()).resolves.toEqual([]);
    expect(service.list).toHaveBeenCalledTimes(1);
  });
});
