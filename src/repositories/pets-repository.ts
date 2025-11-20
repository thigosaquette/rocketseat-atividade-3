import { db } from '@/database/connection';
import { Pet, CreatePetInput, PetFilters, PetWithOrg } from '@/entities/pet';

export class PetsRepository {
  async create(data: CreatePetInput): Promise<Pet> {
    const [pet] = await db('pets')
      .insert({
        org_id: data.org_id,
        name: data.name,
        description: data.description,
        age: data.age,
        size: data.size,
        energy_level: data.energy_level,
        independence_level: data.independence_level,
        environment: data.environment,
        city: data.city,
      })
      .returning('*');

    return pet;
  }

  async findById(id: string): Promise<PetWithOrg | undefined> {
    const pet = await db('pets')
      .where('pets.id', id)
      .join('orgs', 'pets.org_id', 'orgs.id')
      .select(
        'pets.*',
        'orgs.name as org_name',
        'orgs.address as org_address',
        'orgs.whatsapp as org_whatsapp'
      )
      .first();

    if (!pet) {
      return undefined;
    }

    return {
      id: pet.id,
      org_id: pet.org_id,
      name: pet.name,
      description: pet.description,
      age: pet.age,
      size: pet.size,
      energy_level: pet.energy_level,
      independence_level: pet.independence_level,
      environment: pet.environment,
      city: pet.city,
      created_at: pet.created_at,
      org: {
        name: pet.org_name,
        address: pet.org_address,
        whatsapp: pet.org_whatsapp,
      },
    };
  }

  async findByCity(filters: PetFilters): Promise<Pet[]> {
    let query = db('pets').where('city', filters.city);

    if (filters.age) {
      query = query.where('age', filters.age);
    }

    if (filters.size) {
      query = query.where('size', filters.size);
    }

    if (filters.energy_level) {
      query = query.where('energy_level', filters.energy_level);
    }

    if (filters.independence_level) {
      query = query.where('independence_level', filters.independence_level);
    }

    if (filters.environment) {
      query = query.where('environment', filters.environment);
    }

    return query;
  }

  async findByOrgId(orgId: string): Promise<Pet[]> {
    return db('pets').where('org_id', orgId);
  }
}

