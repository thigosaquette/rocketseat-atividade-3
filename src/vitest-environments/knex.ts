import 'dotenv/config';
import { randomUUID } from 'crypto';
import type { Environment } from 'vitest/environments';
import { knex, Knex } from 'knex';
import knexConfig from '../../knexfile';
import * as fs from 'fs';
import * as path from 'path';

// Log para verificar se o módulo está sendo carregado
console.log('🔵 Knex environment module loaded - NODE_ENV:', process.env.NODE_ENV);

// Define TEST_DB_PATH de forma síncrona ANTES de qualquer coisa
// Isso garante que quando connection.ts for importado, já terá o caminho correto
if (process.env.NODE_ENV === 'test' && !process.env.TEST_DB_PATH) {
  const workerId = process.env.VITEST_WORKER_ID || randomUUID().replace(/-/g, '');
  const testDbPath = path.resolve(process.cwd(), `db.test.${workerId}.sqlite`);
  process.env.TEST_DB_PATH = testDbPath;
  console.log('🔵 TEST_DB_PATH definido:', testDbPath);
}

function getDatabasePath() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Wrong environment variables!');
  }

  if (!process.env.TEST_DB_PATH) {
    throw new Error('TEST_DB_PATH não foi definido!');
  }

  return process.env.TEST_DB_PATH;
}

let dbInstance: Knex | null = null;

export default <Environment>{
  name: 'knex',
  transformMode: 'ssr',
  async setup() {
    const testDbPath = getDatabasePath();
    
    // Garante que o diretório existe
    const dbDir = path.dirname(testDbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Remove o banco anterior se existir (limpeza)
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
      } catch (error) {
        // Ignora se não conseguir deletar
      }
    }

    // Cria instância do Knex para este worker
    dbInstance = knex({
      ...knexConfig.test,
      connection: {
        filename: testDbPath,
      },
    });

    // Executa migrations manualmente importando os arquivos TypeScript
    // O Vitest 2.1.8 processa TypeScript automaticamente através do esbuild
    try {
      // Importa e executa as migrations manualmente usando o alias @
      const { up: upOrgs } = await import('@/database/migrations/20240101000000_create_orgs');
      const { up: upPets } = await import('@/database/migrations/20240101000001_create_pets');
      
      await upOrgs(dbInstance);
      await upPets(dbInstance);
      
      console.log(`🟨 Setup test environment! Database: ${testDbPath} 🟨`);
    } catch (error: any) {
      console.error('Error running migrations:', error);
      console.error('Error details:', error.message, error.stack);
      if (dbInstance) {
        await dbInstance.destroy();
      }
      throw error;
    }

    return {
      async teardown() {
        try {
          if (dbInstance) {
            // Fecha todas as conexões pendentes de forma mais agressiva
            try {
              // Tenta fechar todas as conexões do pool
              const pool = (dbInstance as any).client?.pool;
              if (pool) {
                await pool.destroy();
              }
            } catch (poolError) {
              // Ignora erros ao fechar o pool
            }
            
            // Destrói a instância do Knex
            await dbInstance.destroy();
            dbInstance = null;
          }
          
          // Aguarda mais tempo para garantir que todas as conexões foram fechadas
          // Isso é especialmente importante quando o Vitest UI está rodando
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Tenta deletar o arquivo com múltiplas tentativas e delays progressivos
          if (fs.existsSync(testDbPath)) {
            const maxRetries = 3;
            let deleted = false;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                fs.unlinkSync(testDbPath);
                deleted = true;
                break;
              } catch (error: any) {
                if (attempt < maxRetries) {
                  // Aguarda progressivamente mais tempo entre tentativas
                  const delay = attempt * 300;
                  await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                  // Na última tentativa, silencia o warning se for erro esperado
                  // (arquivo em uso é normal quando Vitest UI está rodando)
                  if (error.code !== 'EBUSY' && error.code !== 'EPERM') {
                    console.warn(`⚠️ Could not delete test database: ${testDbPath} - ${error.message}`);
                  }
                  // Se for EBUSY ou EPERM, é esperado no modo UI e será limpo depois
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error during teardown: ${error}`);
        }
      },
    };
  },
} satisfies Environment;
