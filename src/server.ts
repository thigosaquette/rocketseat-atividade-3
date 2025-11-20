import Fastify from 'fastify';
import { config } from 'dotenv';
import { app } from './http/app';

config();

const server = Fastify({
  logger: true,
});

server.register(app);

const port = Number(process.env.PORT) || 3333;

server
  .listen({
    port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });

