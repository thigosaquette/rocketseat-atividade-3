import { FastifyInstance } from 'fastify';
import { OrgsController } from '../controllers/orgs-controller';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { AuthenticateOrgUseCase } from '@/use-cases/authenticate-org-use-case';

export async function orgsRoutes(app: FastifyInstance) {
  const orgsRepository = new OrgsRepository();
  const registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
  const authenticateOrgUseCase = new AuthenticateOrgUseCase(orgsRepository);
  const orgsController = new OrgsController(
    registerOrgUseCase,
    authenticateOrgUseCase
  );

  app.post('/orgs', (request, reply) => orgsController.register(request, reply));
  app.post('/orgs/sessions', (request, reply) =>
    orgsController.authenticate(request, reply)
  );
}

