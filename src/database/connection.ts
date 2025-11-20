import { knex, Knex } from 'knex';
import { config } from 'dotenv';
import knexConfig from '../../knexfile';

config();

const environment = process.env.NODE_ENV || 'development';

// Cria a instância do knex de forma lazy para garantir que TEST_DB_PATH esteja definido
let dbInstance: Knex | null = null;

function getKnexConfig() {
  // Se estiver em modo de teste e tiver TEST_DB_PATH, usa o banco específico do worker
  // Isso garante que cada worker do Vitest usa seu próprio banco isolado
  if (environment === 'test' && process.env.TEST_DB_PATH) {
    return {
      ...knexConfig.test,
      connection: {
        filename: process.env.TEST_DB_PATH,
      },
    } as typeof knexConfig.test;
  }
  return knexConfig[environment] as typeof knexConfig.test;
}

// Função que cria a instância do knex apenas quando necessário
function createDbInstance() {
  if (!dbInstance) {
    dbInstance = knex(getKnexConfig());
  }
  return dbInstance;
}

// Getter que cria a instância do knex apenas quando necessário
export const db = new Proxy(function() {} as any as Knex, {
  get(target, prop) {
    const instance = createDbInstance();
    return (instance as any)[prop];
  },
  apply(target, thisArg, argumentsList) {
    const instance = createDbInstance();
    return (instance as any)(...argumentsList);
  },
});

