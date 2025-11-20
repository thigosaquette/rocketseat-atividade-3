import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pets', (table) => {
    table.text('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-\' || \'4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'));
    table.text('org_id').notNullable().references('id').inTable('orgs').onDelete('CASCADE');
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.text('age').notNullable();
    table.text('size').notNullable();
    table.text('energy_level').notNullable();
    table.text('independence_level').notNullable();
    table.text('environment').notNullable();
    table.text('city').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('pets');
}

