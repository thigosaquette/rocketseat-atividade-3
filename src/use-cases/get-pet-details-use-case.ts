import { PetsRepository } from '@/repositories/pets-repository';
import { PetWithOrg } from '@/entities/pet';

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(petId: string): Promise<PetWithOrg> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    return pet;
  }
}

