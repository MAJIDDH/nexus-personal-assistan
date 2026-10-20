import { BadRequestException, Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit-events')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(@Query('entity_type') entityType?: string, @Query('entity_id') entityId?: string, @Query('limit') limit?: string) {
    if (entityType && entityType !== 'task') throw new BadRequestException('entity_type is not supported.');
    if (entityId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityId)) {
      throw new BadRequestException('entity_id must be a UUID.');
    }
    const parsedLimit = limit === undefined ? 50 : Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 200) {
      throw new BadRequestException('limit must be an integer from 1 to 200.');
    }
    return this.audit.list(entityType, entityId, parsedLimit);
  }
}
