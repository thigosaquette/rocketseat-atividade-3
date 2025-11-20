import 'dotenv/config';
import { randomUUID } from 'crypto';
import type { Environment } from 'vitest/environments';
import { knex, Knex } from 'knex';
import knexConfig from '../../knexfile';
import * as fs from 'fs';
import * as path from 'path';

if (process.env.NODE_ENV === 'test' && !process.env.TEST_DB_PATH) {
  const workerId = process.env.VITEST_WORKER_ID || randomUUID().replace(/-/g, '');
  const dbDir = process.env.RUNNER_TEMP || process.cwd();
  process.env.TEST_DB_PATH = path.resolve(dbDir, `db.test.${workerId}.sqlite`);
}

function getDatabasePath() {
  if (process.env.NODE_ENV !== 'test' || !process.env.TEST_DB_PATH) {
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
    const dbDir = path.dirname(testDbPath);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
    }
    
    if (fs.existsSync(testDbPath)) {
      try {
        fs.chmodSync(testDbPath, 0o666);
        fs.unlinkSync(testDbPath);
      } catch {}
    }

    dbInstance = knex({
      ...knexConfig.test,
      connection: { filename: testDbPath },
    });

    try {
      const { up: upOrgs } = await import('@/database/migrations/20240101000000_create_orgs');
      const { up: upPets } = await import('@/database/migrations/20240101000001_create_pets');
      
      await upOrgs(dbInstance);
      await upPets(dbInstance);
      
      if (fs.existsSync(testDbPath)) {
        fs.chmodSync(testDbPath, 0o666);
      }
    } catch (error: any) {
      if (dbInstance) await dbInstance.destroy();
      throw error;
    }

    return {
      async teardown() {
        if (dbInstance) {
          try {
            const pool = (dbInstance as any).client?.pool;
            if (pool) await pool.destroy();
          } catch {}
          await dbInstance.destroy();
          dbInstance = null;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (fs.existsSync(testDbPath)) {
          for (let i = 0; i < 3; i++) {
            try {
              fs.unlinkSync(testDbPath);
              break;
            } catch (error: any) {
              if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, (i + 1) * 300));
              } else if (error.code !== 'EBUSY' && error.code !== 'EPERM') {
                console.warn(`⚠️ Could not delete test database: ${testDbPath}`);
              }
            }
          }
        }
      },
    };
  },
} satisfies Environment;
