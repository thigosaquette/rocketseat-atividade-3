// @vitest-environment ./src/vitest-environments/knex.ts
import { describe, it, expect, beforeEach } from 'vitest';

// Usa o servidor e db globais configurados no setup.ts
// Cada worker tem seu próprio banco de dados isolado
describe('Pets E2E', () => {
  let authToken: string;
  let orgId: string;

  beforeEach(async () => {
    const registerResponse = await global.server.inject({
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

    const org = JSON.parse(registerResponse.body);
    orgId = org.id;

    const authResponse = await global.server.inject({
      method: 'POST',
      url: '/orgs/sessions',
      payload: {
        email: 'test@example.com',
        password: '123456',
      },
    });

    const auth = JSON.parse(authResponse.body);
    authToken = auth.token;
  });

  it('should be able to create a pet', async () => {
    const response = await global.server.inject({
      method: 'POST',
      url: '/pets',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: 'Rex',
        description: 'Cachorro muito brincalhão',
        age: 'adolescent',
        size: 'medium',
        energy_level: 'high',
        independence_level: 'medium',
        environment: 'medium',
        city: 'São Paulo',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Rex');
    expect(body.org_id).toBe(orgId);
  });

  it('should not be able to create a pet without authentication', async () => {
    const response = await global.server.inject({
      method: 'POST',
      url: '/pets',
      payload: {
        name: 'Rex',
        description: 'Cachorro muito brincalhão',
        age: 'adolescent',
        size: 'medium',
        energy_level: 'high',
        independence_level: 'medium',
        environment: 'medium',
        city: 'São Paulo',
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('should be able to list pets by city', async () => {
    await global.server.inject({
      method: 'POST',
      url: '/pets',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: 'Rex',
        description: 'Cachorro muito brincalhão',
        age: 'adolescent',
        size: 'medium',
        energy_level: 'high',
        independence_level: 'medium',
        environment: 'medium',
        city: 'São Paulo',
      },
    });

    const response = await global.server.inject({
      method: 'GET',
      url: '/pets?city=São Paulo',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('pets');
    expect(body.pets).toHaveLength(1);
  });

  it('should not be able to list pets without city', async () => {
    const response = await global.server.inject({
      method: 'GET',
      url: '/pets',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should be able to get pet details', async () => {
    const createResponse = await global.server.inject({
      method: 'POST',
      url: '/pets',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: 'Rex',
        description: 'Cachorro muito brincalhão',
        age: 'adolescent',
        size: 'medium',
        energy_level: 'high',
        independence_level: 'medium',
        environment: 'medium',
        city: 'São Paulo',
      },
    });

    const pet = JSON.parse(createResponse.body);

    const response = await global.server.inject({
      method: 'GET',
      url: `/pets/${pet.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('id', pet.id);
    expect(body).toHaveProperty('org');
    expect(body.org).toHaveProperty('name');
    expect(body.org).toHaveProperty('address');
    expect(body.org).toHaveProperty('whatsapp');
  });
});

