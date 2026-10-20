import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: 'ok'; service: 'nexus-api' } {
    return { status: 'ok', service: 'nexus-api' };
  }
}
