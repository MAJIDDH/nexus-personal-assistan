import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  getHealth(): { status: 'ok'; service: 'nexus-api' } {
    return { status: 'ok', service: 'nexus-api' };
  }

  @Get('ready')
  async getReadiness(): Promise<{
    status: 'ready';
    service: 'nexus-api';
    dependencies: { database: 'ok' };
  }> {
    if (!(await this.database.ping())) {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'nexus-api',
        dependencies: { database: 'unavailable' },
      });
    }

    return {
      status: 'ready',
      service: 'nexus-api',
      dependencies: { database: 'ok' },
    };
  }
}
