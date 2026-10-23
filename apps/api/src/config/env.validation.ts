import * as Joi from 'joi';

const localDatabaseUrl =
  'postgresql://nexus:nexus_local_only@localhost:5432/nexus_dev';

export const environmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string()
      .uri({ scheme: ['postgres', 'postgresql'] })
      .invalid(localDatabaseUrl)
      .required(),
    otherwise: Joi.string()
      .uri({ scheme: ['postgres', 'postgresql'] })
      .default(localDatabaseUrl),
  }),
});
