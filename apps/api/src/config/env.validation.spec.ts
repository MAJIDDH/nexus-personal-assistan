import { environmentSchema } from './env.validation';

describe('environmentSchema', () => {
  it('applies safe local defaults when optional variables are absent', () => {
    const { error, value } = environmentSchema.validate({});

    expect(error).toBeUndefined();
    expect(value).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_URL:
        'postgresql://nexus:nexus_local_only@localhost:5432/nexus_dev',
    });
  });

  it('accepts a valid local PostgreSQL URL and numeric port', () => {
    const { error, value } = environmentSchema.validate({
      PORT: '3100',
      DATABASE_URL: 'postgres://nexus:example@localhost:5432/nexus_test',
    });

    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3100);
  });

  it('requires an explicit database URL in production', () => {
    const { error } = environmentSchema.validate({
      NODE_ENV: 'production',
    });

    expect(error).toBeDefined();
    expect(error?.details.some((detail) => detail.path.includes('DATABASE_URL'))).toBe(true);
  });

  it('accepts an explicit PostgreSQL URL in production', () => {
    const { error, value } = environmentSchema.validate({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://nexus:configured-secret@db.example.invalid:5432/nexus',
    });

    expect(error).toBeUndefined();
    expect(value.NODE_ENV).toBe('production');
  });

  it('rejects a non-PostgreSQL URL in production', () => {
    const { error } = environmentSchema.validate({
      NODE_ENV: 'production',
      DATABASE_URL: 'https://example.invalid/database',
    });

    expect(error).toBeDefined();
    expect(error?.details.some((detail) => detail.path.includes('DATABASE_URL'))).toBe(true);
  });

  it('keeps the local database default in test mode', () => {
    const { error, value } = environmentSchema.validate({ NODE_ENV: 'test' });

    expect(error).toBeUndefined();
    expect(value.DATABASE_URL).toBe(
      'postgresql://nexus:nexus_local_only@localhost:5432/nexus_dev',
    );
  });

  it('rejects invalid ports', () => {
    const { error } = environmentSchema.validate({ PORT: 70000 });

    expect(error).toBeDefined();
  });

  it('rejects non-PostgreSQL database URL schemes', () => {
    const { error } = environmentSchema.validate({
      DATABASE_URL: 'https://example.invalid/database',
    });

    expect(error).toBeDefined();
  });
});
