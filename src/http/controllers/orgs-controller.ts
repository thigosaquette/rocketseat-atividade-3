import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterOrgUseCase } from '@/use-cases/register-org-use-case';
import { AuthenticateOrgUseCase } from '@/use-cases/authenticate-org-use-case';
import { z } from 'zod';

const registerOrgBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string().min(1),
  whatsapp: z.string().min(1),
});

const authenticateOrgBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class OrgsController {
  constructor(
    private registerOrgUseCase: RegisterOrgUseCase,
    private authenticateOrgUseCase: AuthenticateOrgUseCase
  ) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerOrgBodySchema.parse(request.body);

      const org = await this.registerOrgUseCase.execute(body);

      return reply.status(201).send(org);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos', errors: error.errors });
      }

      if (error instanceof Error && error.message === 'Email já está em uso') {
        return reply.status(409).send({ message: error.message });
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  }

  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = authenticateOrgBodySchema.parse(request.body);

      const { org } = await this.authenticateOrgUseCase.execute(body);

      const token = await reply.jwtSign(
        { sub: org.id },
        { expiresIn: '7d' }
      );

      return reply.status(200).send({ token });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos', errors: error.errors });
      }

      if (error instanceof Error && error.message === 'Credenciais inválidas') {
        return reply.status(401).send({ message: error.message });
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  }
}

