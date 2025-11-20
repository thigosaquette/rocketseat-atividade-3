import { config } from 'dotenv';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { app } from '@/http/app';
import * as fs from 'fs';
import * as path from 'path';

config();

// Define variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Importa connection - o ambiente customizado deve ter definido TEST_DB_PATH
// Se não estiver definido, será usado o padrão do knexfile
import { db } from '@/database/connection';

// Cria e configura o servidor Fastify globalmente
let server: FastifyInstance;

beforeAll(async () => {
  try {
    // Configurar servidor Fastify
    server = Fastify({
      logger: false,
    });
    
    await server.register(app);
    await server.ready();

    // Disponibilizar servidor e db globalmente
    global.server = server;
    global.db = db;
  } catch (error) {
    console.error('Error setting up tests:', error);
    throw error;
  }
});

// Limpa os dados antes de cada teste para garantir isolamento
beforeEach(async () => {
  await db('pets').delete();
  await db('orgs').delete();
});

// Limpar e fechar conexão após todos os testes
afterAll(async () => {
  if (server) {
    await server.close();
  }
  
  // Limpa todos os arquivos de banco de teste que possam ter ficado
  try {
    const testDbPattern = /^db\.test\.\d+\.sqlite$/;
    const files = fs.readdirSync(process.cwd());
    
    for (const file of files) {
      if (testDbPattern.test(file)) {
        const filePath = path.join(process.cwd(), file);
        try {
          fs.unlinkSync(filePath);
          console.log(`✅ Cleaned up test database: ${file}`);
        } catch (error) {
          // Ignora erros ao deletar (pode estar em uso ainda)
        }
      }
    }
  } catch (error) {
    // Ignora erros na limpeza final
  }
});

