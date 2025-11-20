import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface Tables {
    orgs: {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      address: string;
      whatsapp: string;
      created_at: Date;
    };
    pets: {
      id: string;
      org_id: string;
      name: string;
      description: string;
      age: string;
      size: string;
      energy_level: string;
      independence_level: string;
      environment: string;
      city: string;
      created_at: Date;
    };
  }
}

