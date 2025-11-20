import { describe, it, expect, beforeEach } from 'vitest';
import { PetsController } from '@/http/controllers/pets-controller';
import { CreatePetUseCase } from '@/use-cases/create-pet-use-case';
import { ListPetsByCityUseCase } from '@/use-cases/list-pets-by-city-use-case';
import { GetPetDetailsUseCase } from '@/use-cases/get-pet-details-use-case';
import { PetsRepository } from '@/repositories/pets-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';

describe('PetsController', () => {
  let petsController: PetsController;
  let createPetUseCase: CreatePetUseCase;
  let listPetsByCityUseCase: ListPetsByCityUseCase;
  let getPetDetailsUseCase: GetPetDetailsUseCase;
  let petsRepository: PetsRepository;
  let orgsRepository: OrgsRepository;

  beforeEach(() => {
    petsRepository = new PetsRepository();
    orgsRepository = new OrgsRepository();
    createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository);
    listPetsByCityUseCase = new ListPetsByCityUseCase(petsRepository);
    getPetDetailsUseCase = new GetPetDetailsUseCase(petsRepository);
    petsController = new PetsController(
      createPetUseCase,
      listPetsByCityUseCase,
      getPetDetailsUseCase
    );
  });

  it('should be able to list pets by city', async () => {
    const request = {
      query: {
        city: 'São Paulo',
      },
    } as any;

    const reply = {
      status: (code: number) => ({
        send: (data: any) => ({ code, data }),
      }),
    } as any;

    const result = await petsController.list(request, reply);

    expect(result.code).toBe(200);
    expect(result.data).toHaveProperty('pets');
  });

  it('should not be able to list pets without city', async () => {
    const request = {
      query: {},
    } as any;

    const reply = {
      status: (code: number) => ({
        send: (data: any) => ({ code, data }),
      }),
    } as any;

    const result = await petsController.list(request, reply);

    expect(result.code).toBe(400);
  });
});

