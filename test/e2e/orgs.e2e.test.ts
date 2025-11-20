// @vitest-environment ./src/vitest-environments/knex.ts
import { describe, it, expect } from 'vitest';

// Usa o servidor e db globais configurados no setup.ts
// Cada worker tem seu próprio banco de dados isolado
describe('Orgs E2E', () => {
  it('should be able to register a new org', async () => {
    const response = await global.server.inject({
      method: 'POST',
      url: '/orgs',
      payload: {
        name: 'Test Org',
        email: 'test@example.com',
        password: '123456',
        address: 'Rua Test, 123',
        whatsapp: '11999999999',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Test Org');
    expect(body.email).toBe('test@example.com');
    expect(body).not.toHaveProperty('password_hash');
  });

  it('should be able to authenticate an org', async () => {
    await global.server.inject({
      method: 'POST',
      url: '/orgs',
      payload: {
        name: 'Test Org',
        email: 'test@example.com',
        password: '123456',
        address: 'Rua Test, 123',
        whatsapp: '11999999999',
      },
    });

    const response = await global.server.inject({
      method: 'POST',
      url: '/orgs/sessions',
      payload: {
        email: 'test@example.com',
        password: '123456',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
  });

  it('should not be able to authenticate with wrong credentials', async () => {
    const response = await global.server.inject({
      method: 'POST',
      url: '/orgs/sessions',
      payload: {
        email: 'wrong@example.com',
        password: '123456',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});

