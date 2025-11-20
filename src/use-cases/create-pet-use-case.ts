import { PetsRepository } from '@/repositories/pets-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { CreatePetInput, Pet } from '@/entities/pet';

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository
  ) {}

  async execute(data: CreatePetInput): Promise<Pet> {
    const org = await this.orgsRepository.findById(data.org_id);

    if (!org) {
      throw new Error('ORG não encontrada');
    }

    const pet = await this.petsRepository.create(data);

    return pet;
  }
}

