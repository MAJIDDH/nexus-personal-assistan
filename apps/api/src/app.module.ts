import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MockModelProvider } from './ai/mock-model.provider';
import { environmentSchema } from './config/env.validation';
import { HealthController } from './health/health.controller';
import { ToolPolicyService } from './security/tool-policy.service';
import { DatabaseModule } from './database/database.module';
import { ContentIdeasModule } from './content-ideas/content-ideas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
    DatabaseModule,
    ContentIdeasModule,
  ],
  controllers: [AppController, HealthController],
  providers: [ToolPolicyService, MockModelProvider],
})
export class AppModule {}
