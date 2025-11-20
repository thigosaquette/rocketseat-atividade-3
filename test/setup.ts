import { config } from 'dotenv';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { app } from '@/http/app';
import * as fs from 'fs';
import * as path from 'path';
import { db } from '@/database/connection';

config();

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

let server: FastifyInstance;

beforeAll(async () => {
  server = Fastify({ logger: false });
  await server.register(app);
  await server.ready();
  global.server = server;
  global.db = db;
});

beforeEach(async () => {
  await db('pets').delete();
  await db('orgs').delete();
});

afterAll(async () => {
  if (server) await server.close();
  
  // Limpa arquivos de teste órfãos
  try {
    const files = fs.readdirSync(process.cwd());
    for (const file of files) {
      if (/^db\.test\.\d+\.sqlite$/.test(file)) {
        try {
          fs.unlinkSync(path.join(process.cwd(), file));
        } catch {}
      }
    }
  } catch {}
});

