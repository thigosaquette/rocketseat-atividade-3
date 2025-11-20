import { PetsRepository } from '@/repositories/pets-repository';
import { Pet, PetFilters } from '@/entities/pet';

export class ListPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(filters: PetFilters): Promise<Pet[]> {
    if (!filters.city) {
      throw new Error('Cidade é obrigatória');
    }

    const pets = await this.petsRepository.findByCity(filters);

    return pets;
  }
}

