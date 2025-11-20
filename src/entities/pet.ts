export interface Pet {
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
}

export interface CreatePetInput {
  org_id: string;
  name: string;
  description: string;
  age: string;
  size: string;
  energy_level: string;
  independence_level: string;
  environment: string;
  city: string;
}

export interface PetFilters {
  city: string;
  age?: string;
  size?: string;
  energy_level?: string;
  independence_level?: string;
  environment?: string;
}

export interface PetWithOrg extends Pet {
  org: {
    name: string;
    address: string;
    whatsapp: string;
  };
}

