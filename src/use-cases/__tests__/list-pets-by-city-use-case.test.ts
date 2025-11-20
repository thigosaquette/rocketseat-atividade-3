import { describe, it, expect, beforeEach } from 'vitest';
import { ListPetsByCityUseCase } from '../list-pets-by-city-use-case';
import { CreatePetUseCase } from '../create-pet-use-case';
import { RegisterOrgUseCase } from '../register-org-use-case';
import { PetsRepository } from '@/repositories/pets-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { db } from '@/database/connection';

describe('ListPetsByCityUseCase', () => {
  let listPetsByCityUseCase: ListPetsByCityUseCase;
  let createPetUseCase: CreatePetUseCase;
  let registerOrgUseCase: RegisterOrgUseCase;
  let petsRepository: PetsRepository;
  let orgsRepository: OrgsRepository;

  beforeEach(async () => {
    await db('pets').delete();
    await db('orgs').delete();
    petsRepository = new PetsRepository();
    orgsRepository = new OrgsRepository();
    listPetsByCityUseCase = new ListPetsByCityUseCase(petsRepository);
    createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository);
    registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
  });

  it('should be able to list pets by city', async () => {
    const org = await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    await createPetUseCase.execute({
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

    const pets = await listPetsByCityUseCase.execute({
      city: 'São Paulo',
    });

    expect(pets).toHaveLength(1);
    expect(pets[0].city).toBe('São Paulo');
  });

  it('should not be able to list pets without city', async () => {
    await expect(
      listPetsByCityUseCase.execute({
        city: '',
      } as any)
    ).rejects.toThrow('Cidade é obrigatória');
  });

  it('should be able to filter pets by characteristics', async () => {
    const org = await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    await createPetUseCase.execute({
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

    const pets = await listPetsByCityUseCase.execute({
      city: 'São Paulo',
      age: 'adolescent',
      size: 'medium',
    });

    expect(pets).toHaveLength(1);
  });
});

