# FindAFriend API - Documentação

## Endpoints

### ORGs (Organizações)

#### POST /orgs
Cadastra uma nova organização.

**Body:**
```json
{
  "name": "Nome da Organização",
  "email": "org@example.com",
  "password": "senha123",
  "address": "Rua Exemplo, 123",
  "whatsapp": "11999999999"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Nome da Organização",
  "email": "org@example.com",
  "address": "Rua Exemplo, 123",
  "whatsapp": "11999999999",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### POST /orgs/sessions
Autentica uma organização e retorna um token JWT.

**Body:**
```json
{
  "email": "org@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token"
}
```

### Pets

#### POST /pets
Cadastra um novo pet. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Rex",
  "description": "Cachorro muito brincalhão",
  "age": "adolescent",
  "size": "medium",
  "energy_level": "high",
  "independence_level": "medium",
  "environment": "medium",
  "city": "São Paulo"
}
```

**Valores possíveis:**
- `age`: "cub" | "adolescent" | "elderly"
- `size`: "small" | "medium" | "big"
- `energy_level`: "low" | "medium" | "high"
- `independence_level`: "low" | "medium" | "high"
- `environment`: "small" | "medium" | "big"

**Response (201):**
```json
{
  "id": "uuid",
  "org_id": "uuid",
  "name": "Rex",
  "description": "Cachorro muito brincalhão",
  "age": "adolescent",
  "size": "medium",
  "energy_level": "high",
  "independence_level": "medium",
  "environment": "medium",
  "city": "São Paulo",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### GET /pets?city={cidade}
Lista pets disponíveis em uma cidade. A cidade é obrigatória.

**Query Parameters:**
- `city` (obrigatório): Nome da cidade
- `age` (opcional): "cub" | "adolescent" | "elderly"
- `size` (opcional): "small" | "medium" | "big"
- `energy_level` (opcional): "low" | "medium" | "high"
- `independence_level` (opcional): "low" | "medium" | "high"
- `environment` (opcional): "small" | "medium" | "big"

**Exemplo:**
```
GET /pets?city=São Paulo&age=adolescent&size=medium
```

**Response (200):**
```json
{
  "pets": [
    {
      "id": "uuid",
      "org_id": "uuid",
      "name": "Rex",
      "description": "Cachorro muito brincalhão",
      "age": "adolescent",
      "size": "medium",
      "energy_level": "high",
      "independence_level": "medium",
      "environment": "medium",
      "city": "São Paulo",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /pets/:id
Retorna os detalhes de um pet específico, incluindo informações da ORG.

**Response (200):**
```json
{
  "id": "uuid",
  "org_id": "uuid",
  "name": "Rex",
  "description": "Cachorro muito brincalhão",
  "age": "adolescent",
  "size": "medium",
  "energy_level": "high",
  "independence_level": "medium",
  "environment": "medium",
  "city": "São Paulo",
  "created_at": "2024-01-01T00:00:00.000Z",
  "org": {
    "name": "Nome da Organização",
    "address": "Rua Exemplo, 123",
    "whatsapp": "11999999999"
  }
}
```

## Regras de Negócio

1. A informação da cidade é obrigatória para listar os pets
2. Uma ORG deve, obrigatoriamente, ter um endereço e um número de WhatsApp
3. Todo pet cadastrado precisa estar vinculado a uma ORG
4. O contato do usuário interessado em adotar um pet será feito diretamente com a ORG via WhatsApp
5. Todos os filtros de características do pet, com exceção da cidade, são opcionais
6. Para que uma ORG tenha acesso administrativo à aplicação, ela deve estar logada

