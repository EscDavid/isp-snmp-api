import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { SnmpService } from '../../../modules/snmp/snmp.service.js';
import { OLTVendor } from '../../../shared/types/snmp.types.js';
import { AppError } from '../../../shared/errors/app-error.js';

const snmpGetBodySchema = z.object({
  vendor: z.nativeEnum(OLTVendor).default(OLTVendor.GENERIC),
  oid: z.string().min(1),
  connection: z.object({
    host: z.string().min(1),
    port: z.number().int().positive().max(65535).optional(),
    community: z.string().min(1),
    timeout: z.number().int().positive(),
    retries: z.number().int().min(0),
  }),
});

export async function snmpRoutes(app: FastifyInstance): Promise<void> {
  const snmpService = new SnmpService();

  app.post('/get', async (request, reply) => {
    const parsedBody = snmpGetBodySchema.safeParse(request.body);
    if (!parsedBody.success) {
      return reply.status(400).send({
        status: 'error',
        message: 'Invalid request payload',
        details: parsedBody.error.flatten(),
      });
    }

    try {
      const result = await snmpService.get(parsedBody.data);

      return reply.status(200).send({
        status: 'ok',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }

      throw error;
    }
  });
}
