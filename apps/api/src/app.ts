import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';

export interface HealthResponse {
  status: 'ok';
  service: 'goods-import-api';
}

const HEALTH_RESPONSE: HealthResponse = Object.freeze({
  status: 'ok',
  service: 'goods-import-api',
});

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  // Skeleton etape CORS atviras lokaliam klientui. Prieš diegimą – susiaurinti.
  await app.register(cors, { origin: true });

  app.get<{ Reply: HealthResponse }>('/health', async () => HEALTH_RESPONSE);

  return app;
}
