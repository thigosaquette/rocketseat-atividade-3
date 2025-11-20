import { FastifyReply, FastifyRequest } from 'fastify';
import { CreatePetUseCase } from '@/use-cases/create-pet-use-case';
import { ListPetsByCityUseCase } from '@/use-cases/list-pets-by-city-use-case';
import { GetPetDetailsUseCase } from '@/use-cases/get-pet-details-use-case';
import { z } from 'zod';

const createPetBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  age: z.enum(['cub', 'adolescent', 'elderly']),
  size: z.enum(['small', 'medium', 'big']),
  energy_level: z.enum(['low', 'medium', 'high']),
  independence_level: z.enum(['low', 'medium', 'high']),
  environment: z.enum(['small', 'medium', 'big']),
  city: z.string().min(1),
});

const listPetsQuerySchema = z.object({
  city: z.string().min(1),
  age: z.enum(['cub', 'adolescent', 'elderly']).optional(),
  size: z.enum(['small', 'medium', 'big']).optional(),
  energy_level: z.enum(['low', 'medium', 'high']).optional(),
  independence_level: z.enum(['low', 'medium', 'high']).optional(),
  environment: z.enum(['small', 'medium', 'big']).optional(),
});

export class PetsController {
  constructor(
    private createPetUseCase: CreatePetUseCase,
    private listPetsByCityUseCase: ListPetsByCityUseCase,
    private getPetDetailsUseCase: GetPetDetailsUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createPetBodySchema.parse(request.body);
      const orgId = request.user.sub;

      const pet = await this.createPetUseCase.execute({
        ...body,
        org_id: orgId,
      });

      return reply.status(201).send(pet);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos', errors: error.errors });
      }

      if (error instanceof Error && error.message === 'ORG não encontrada') {
        return reply.status(404).send({ message: error.message });
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = listPetsQuerySchema.parse(request.query);

      const pets = await this.listPetsByCityUseCase.execute(query);

      return reply.status(200).send({ pets });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos', errors: error.errors });
      }

      if (error instanceof Error && error.message === 'Cidade é obrigatória') {
        return reply.status(400).send({ message: error.message });
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const pet = await this.getPetDetailsUseCase.execute(id);

      return reply.status(200).send(pet);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Pet não encontrado') {
        return reply.status(404).send({ message: error.message });
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  }
}

