import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController();
  });

  it('identifies the service as the local NEXUS prototype', () => {
    expect(controller.getStatus()).toEqual({
      name: 'NEXUS',
      mode: 'local-prototype',
    });
  });
});
