import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus(): { name: 'NEXUS'; mode: 'local-prototype' } {
    return { name: 'NEXUS', mode: 'local-prototype' };
  }
}
