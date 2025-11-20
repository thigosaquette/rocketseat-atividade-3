import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePetUseCase } from '@/use-cases/create-pet-use-case';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { PetsRepository } from '@/repositories/pets-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { db } from '@/database/connection';

describe('CreatePetUseCase', () => {
  let createPetUseCase: CreatePetUseCase;
  let registerOrgUseCase: RegisterOrgUseCase;
  let petsRepository: PetsRepository;
  let orgsRepository: OrgsRepository;

  beforeEach(async () => {
    await db('pets').delete();
    await db('orgs').delete();
    petsRepository = new PetsRepository();
    orgsRepository = new OrgsRepository();
    createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository);
    registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
  });

  it('should be able to create a pet', async () => {
    const org = await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    const pet = await createPetUseCase.execute({
      org_id: org.id,
      name: 'Rex',
      description: 'Cachorro muito brincalhão',
      age: 'adolescent',
      size: 'medium',
      energy_level: 'high',
      independence_level: 'medium',
      environment: 'medium',
      city: 'São Paulo',
    });

    expect(pet).toHaveProperty('id');
    expect(pet.name).toBe('Rex');
    expect(pet.org_id).toBe(org.id);
  });

  it('should not be able to create a pet with invalid org_id', async () => {
    await expect(
      createPetUseCase.execute({
        org_id: 'invalid-org-id',
        name: 'Rex',
        description: 'Cachorro muito brincalhão',
        age: 'adolescent',
        size: 'medium',
        energy_level: 'high',
        independence_level: 'medium',
        environment: 'medium',
        city: 'São Paulo',
      })
    ).rejects.toThrow('ORG não encontrada');
  });
});

