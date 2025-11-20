import { describe, it, expect, beforeEach } from 'vitest';
import { OrgsController } from '../orgs-controller';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { AuthenticateOrgUseCase } from '@/use-cases/authenticate-org-use-case';
import { OrgsRepository } from '@/repositories/orgs-repository';

describe('OrgsController', () => {
  let orgsController: OrgsController;
  let registerOrgUseCase: RegisterOrgUseCase;
  let authenticateOrgUseCase: AuthenticateOrgUseCase;
  let orgsRepository: OrgsRepository;

  beforeEach(() => {
    orgsRepository = new OrgsRepository();
    registerOrgUseCase = new RegisterOrgUseCase(orgsRepository);
    authenticateOrgUseCase = new AuthenticateOrgUseCase(orgsRepository);
    orgsController = new OrgsController(
      registerOrgUseCase,
      authenticateOrgUseCase
    );
  });

  it('should be able to register a new org', async () => {
    const request = {
      body: {
        name: 'Test Org',
        email: 'test@example.com',
        password: '123456',
        address: 'Rua Test, 123',
        whatsapp: '11999999999',
      },
    } as any;

    const reply = {
      status: (code: number) => ({
        send: (data: any) => ({ code, data }),
      }),
      jwtSign: async () => 'token',
    } as any;

    const result = await orgsController.register(request, reply);

    expect(result.code).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name', 'Test Org');
    expect(result.data).toHaveProperty('email', 'test@example.com');
    expect(result.data).not.toHaveProperty('password_hash');
  });

  it('should not be able to register with invalid data', async () => {
    const request = {
      body: {
        name: '',
        email: 'invalid-email',
        password: '123',
      },
    } as any;

    const reply = {
      status: (code: number) => ({
        send: (data: any) => ({ code, data }),
      }),
    } as any;

    const result = await orgsController.register(request, reply);

    expect(result.code).toBe(400);
  });
});

