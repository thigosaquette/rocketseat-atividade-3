import { db } from '@/database/connection';
import { Org, CreateOrgInput } from '@/entities/org';

export class OrgsRepository {
  async create(data: CreateOrgInput & { password_hash: string }): Promise<Org> {
    const [org] = await db('orgs')
      .insert({
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        address: data.address,
        whatsapp: data.whatsapp,
      })
      .returning('*');

    return org;
  }

  async findByEmail(email: string): Promise<Org | undefined> {
    const org = await db('orgs').where({ email }).first();
    return org;
  }

  async findById(id: string): Promise<Org | undefined> {
    const org = await db('orgs').where({ id }).first();
    return org;
  }
}

