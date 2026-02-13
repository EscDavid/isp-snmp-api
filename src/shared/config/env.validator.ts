import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url().default('postgresql://user:password@localhost:5432/snmp_api'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32).default('change-me-in-production-super-secret-key-123456'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  SNMP_TIMEOUT: z.coerce.number().default(5000),
  SNMP_RETRIES: z.coerce.number().default(2),
  OID_ALLOWLIST: z.string().default('1.3.6.1.2.1'),
  OID_DENYLIST: z.string().default('1.3.6.1.6.3.15'),
  AUDIT_PERSISTENCE_ENABLED: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
