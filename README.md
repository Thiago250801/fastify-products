# Fastify Produtos API

API REST construída com Fastify, Prisma e PostgreSQL para autenticação JWT, controle de acesso por papéis e CRUD de produtos.

## Stack
- Fastify 5 com `fastify-type-provider-zod`
- Prisma 7 com PostgreSQL
- JWT com `jsonwebtoken`
- Cookies HttpOnly com `@fastify/cookie`
- Documentação OpenAPI com Swagger UI
- CORS com `@fastify/cors`
- Logs formatados com `pino-pretty`

## Pré-requisitos
1. Node.js 20+
2. Docker e Docker Compose, ou uma instância local de PostgreSQL
3. Um arquivo `.env` com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/produtos?schema=public"
JWT_SECRET="supersecret"
COOKIE_SECRET="cookie-secret"
NODE_ENV="development"
PORT="3333"
```

O jeito recomendado neste projeto para subir o banco é usar Docker com o `docker-compose.yml`.

## Instalação
```bash
npm install
docker compose up -d postgres
npx prisma generate
npx prisma migrate dev
npm run dev
```

O servidor usa a variável de ambiente `PORT` e faz fallback para `3333` em desenvolvimento. Por padrão, a documentação fica em `http://localhost:3333/docs`.

Isso é importante para deploy no Render e em outros providers, que injetam a porta HTTP via ambiente.

## Scripts
| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com reload via `tsx watch`. |
| `npm run build` | Compila o projeto TypeScript para `dist/`. |
| `npm start` | Executa a versão compilada. |
| `npm run test` | Placeholder atual, ainda sem suíte configurada. |

## Banco de dados
### PostgreSQL com Docker
O projeto já inclui um `docker-compose.yml` para subir a imagem do PostgreSQL localmente.

Configuração usada pelo container:
- imagem: `postgres:16`
- porta: `5432`
- banco: `produtos`
- usuário: `postgres`
- senha: `postgres`

Comandos úteis:

```bash
docker compose up -d postgres
docker compose ps
docker compose logs -f postgres
docker compose down
```

A `DATABASE_URL` do `.env` já está alinhada com essa configuração:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/produtos?schema=public"
```

Se você estiver começando do zero, o fluxo recomendado é:

```bash
docker compose up -d postgres
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Schema e migration
O projeto usa uma migration inicial consolidada em:

`prisma/migrations/20260316205515_init/migration.sql`

Essa baseline cria:
- enum `UserRole` com valores `USER` e `ADMIN`
- tabela `User`
- tabela `Product`
- relacionamento de `Product` com `User`
- índice único para email de usuário

O schema Prisma atual define:
- `User`: `id`, `name`, `email`, `password`, `role`, `refreshToken`, `createdAt`
- `Product`: `id`, `name`, `price`, `userId`, `createdAt`, `updatedAt`

## Autenticação e segurança
- `POST /auth/register` cria usuário e retorna `user`, `accessToken` e `refreshToken`
- `POST /auth/login` autentica e retorna a mesma estrutura
- `GET /auth/me` retorna o usuário autenticado
- O middleware aceita `Authorization: Bearer <token>` ou cookie `auth_token`
- As rotas administrativas exigem `role === "ADMIN"`
- Os cookies `auth_token` e `refresh_token` são `httpOnly`, com `sameSite=lax` e `secure` em produção

## CORS
O servidor registra `@fastify/cors` com `credentials: true`.

Origens permitidas:
- desenvolvimento: `http://localhost:3000`
- produção: `https://myproductiondomain.com`

Métodos liberados:
- `GET`
- `POST`
- `PUT`
- `DELETE`

## Endpoints principais

### Auth
| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/auth/register` | Registra um novo usuário. |
| `POST` | `/auth/login` | Faz login e define cookies HttpOnly. |
| `GET` | `/auth/me` | Retorna o usuário autenticado. |

### Products
| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/products` | Lista todos os produtos. |
| `GET` | `/products/:id` | Busca um produto por ID. |
| `POST` | `/products` | Cria produto para o usuário autenticado. |
| `PUT` | `/products/:id` | Atualiza produto do dono ou de um ADMIN. |
| `DELETE` | `/products/:id` | Remove produto do dono ou de um ADMIN. |

### Users
| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/users` | Lista usuários. |
| `GET` | `/users/:id` | Busca usuário por ID. |
| `PATCH` | `/users/:id` | Atualiza nome, email, senha ou papel. |
| `DELETE` | `/users/:id` | Remove usuário. |

Todas as rotas de `Users` exigem autenticação e permissão de administrador.

## Formato das respostas
As respostas de produto seguem o formato:

```json
{
  "data": {
    "id": "uuid",
    "name": "Notebook",
    "price": 3500,
    "userId": "uuid",
    "createdAt": "2026-03-21T12:00:00.000Z",
    "updatedAt": "2026-03-21T12:30:00.000Z",
    "user": {
      "id": "uuid",
      "name": "Thiago",
      "email": "thiago@email.com",
      "role": "USER",
      "createdAt": "2026-03-21T12:00:00.000Z"
    }
  }
}
```

As datas são serializadas como strings ISO.

## Tratamento de erros
- `401` para falhas de autenticação
- `403` para ações sem permissão
- `404` para recurso não encontrado
- `500` para erro interno não tratado

O handler global também trata `PrismaClientKnownRequestError` com código `P2025` como `404`.

## Swagger
O OpenAPI é gerado automaticamente e exposto em `/docs`, com as tags:
- `Auth`
- `Products`
- `Users`

O esquema `BearerAuth` já está configurado para testes no Swagger UI.

## Observações
- O projeto usa logs formatados com `pino-pretty` no servidor Fastify.
- O `refreshToken` é persistido no banco após login e registro.
- Ainda não existe suíte de testes automatizados configurada.
