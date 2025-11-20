import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { db } from '@/database/connection';

describe('RegisterOrgUseCase', () => {
  let registerOrgUseCase: RegisterOrgUseCase;
  let orgsRepository: OrgsRepository;

  beforeEach(async () => {
    await db('orgs').delete();
    orgsRepository = new OrgsRepository();
    registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
  });

  it('should be able to register a new org', async () => {
    const org = await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    expect(org).toHaveProperty('id');
    expect(org.name).toBe('Test Org');
    expect(org.email).toBe('test@example.com');
    expect(org).not.toHaveProperty('password_hash');
  });

  it('should not be able to register with same email twice', async () => {
    await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    await expect(
      registerOrgUseCase.execute({
        name: 'Test Org 2',
        email: 'test@example.com',
        password: '123456',
        address: 'Rua Test, 456',
        whatsapp: '11999999999',
      })
    ).rejects.toThrow('Email já está em uso');
  });
});

