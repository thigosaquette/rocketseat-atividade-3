import { FastifyInstance } from 'fastify';
import { orgsRoutes } from './routes/orgs-routes';
import { petsRoutes } from './routes/pets-routes';

export async function app(app: FastifyInstance) {
  app.register(import('@fastify/cors'), {
    origin: true,
  });

  app.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'default-secret-key',
  });

  app.register(orgsRoutes);
  app.register(petsRoutes);
}

