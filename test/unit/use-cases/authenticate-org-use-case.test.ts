import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateOrgUseCase } from '@/use-cases/authenticate-org-use-case';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { db } from '@/database/connection';

describe('AuthenticateOrgUseCase', () => {
  let authenticateOrgUseCase: AuthenticateOrgUseCase;
  let registerOrgUseCase: RegisterOrgUseCase;
  let orgsRepository: OrgsRepository;

  beforeEach(async () => {
    await db('orgs').delete();
    orgsRepository = new OrgsRepository();
    authenticateOrgUseCase = new AuthenticateOrgUseCase(orgsRepository);
    registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
  });

  it('should be able to authenticate an org', async () => {
    await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    const { org } = await authenticateOrgUseCase.execute({
      email: 'test@example.com',
      password: '123456',
    });

    expect(org).toHaveProperty('id');
    expect(org.email).toBe('test@example.com');
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      authenticateOrgUseCase.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    ).rejects.toThrow('Credenciais inválidas');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await registerOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@example.com',
      password: '123456',
      address: 'Rua Test, 123',
      whatsapp: '11999999999',
    });

    await expect(
      authenticateOrgUseCase.execute({
        email: 'test@example.com',
        password: 'wrong-password',
      })
    ).rejects.toThrow('Credenciais inválidas');
  });
});

