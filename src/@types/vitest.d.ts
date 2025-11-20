import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';

declare global {
  // eslint-disable-next-line no-var
  var server: FastifyInstance;
  // eslint-disable-next-line no-var
  var db: Knex;
}

