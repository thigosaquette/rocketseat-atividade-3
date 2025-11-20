import { FastifyInstance } from 'fastify';
import { PetsController } from '../controllers/pets-controller';
import { PetsRepository } from '@/repositories/pets-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { CreatePetUseCase } from '@/use-cases/create-pet-use-case';
import { ListPetsByCityUseCase } from '@/use-cases/list-pets-by-city-use-case';
import { GetPetDetailsUseCase } from '@/use-cases/get-pet-details-use-case';
import { verifyJWT } from '../middlewares/verify-jwt';

export async function petsRoutes(app: FastifyInstance) {
  const petsRepository = new PetsRepository();
  const orgsRepository = new OrgsRepository();
  const createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository);
  const listPetsByCityUseCase = new ListPetsByCityUseCase(petsRepository);
  const getPetDetailsUseCase = new GetPetDetailsUseCase(petsRepository);
  const petsController = new PetsController(
    createPetUseCase,
    listPetsByCityUseCase,
    getPetDetailsUseCase
  );

  app.post(
    '/pets',
    { preHandler: [verifyJWT] },
    (request, reply) => petsController.create(request, reply)
  );

  app.get('/pets', (request, reply) => petsController.list(request, reply));

  app.get('/pets/:id', (request, reply) => petsController.show(request, reply));
}

