import { OrgsRepository } from '@/repositories/orgs-repository';
import { CreateOrgInput, OrgWithoutPassword } from '@/entities/org';
import { hash } from 'bcryptjs';

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(data: CreateOrgInput): Promise<OrgWithoutPassword> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(data.email);

    if (orgWithSameEmail) {
      throw new Error('Email já está em uso');
    }

    const password_hash = await hash(data.password, 6);

    const org = await this.orgsRepository.create({
      ...data,
      password_hash,
    });

    const { password_hash: _, ...orgWithoutPassword } = org;

    return orgWithoutPassword;
  }
}

