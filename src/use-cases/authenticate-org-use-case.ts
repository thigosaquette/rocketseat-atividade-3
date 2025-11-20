import { OrgsRepository } from '@/repositories/orgs-repository';
import { compare } from 'bcryptjs';

export interface AuthenticateOrgInput {
  email: string;
  password: string;
}

export interface AuthenticateOrgOutput {
  org: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(
    data: AuthenticateOrgInput
  ): Promise<AuthenticateOrgOutput> {
    const org = await this.orgsRepository.findByEmail(data.email);

    if (!org) {
      throw new Error('Credenciais inválidas');
    }

    const doesPasswordMatches = await compare(data.password, org.password_hash);

    if (!doesPasswordMatches) {
      throw new Error('Credenciais inválidas');
    }

    return {
      org: {
        id: org.id,
        name: org.name,
        email: org.email,
      },
    };
  }
}

