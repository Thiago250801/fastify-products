# Fastify Produtos API

API REST construída com Fastify + Prisma para gestão de produtos com autenticação JWT, autorização baseada em papéis e documentação Swagger.

## Tecnologias principais
- Fastify 5 com `fastify-type-provider-zod` para garantir validações e serializações tipadas.
- Prisma (Adapter PG) + PostgreSQL com migrations versionadas (`prisma/migrations/...`).
- JWT (`jsonwebtoken`) com tokens de acesso (15 minutos) e refresh (7 dias) contendo o papel do usuário.
- Zod para schemas (`src/schemas/*`), Fastify Swagger para documentação em `/docs`.

## Pré-requisitos
1. Node.js 20+ (compatível com dependências `typescript 5.9`, `tsx`).
2. PostgreSQL (pode rodar via Docker Compose disponível em `docker-compose.yml`).
3. Variáveis de ambiente definidas em `.env`:
   - `DATABASE_URL` (ex.: `postgresql://postgres:postgres@localhost:5432/produtos?schema=public`).
   - `JWT_SECRET` (opcional; padrão `supersecret`, mas defina um valor forte para produção).
   - `COOKIE_SECRET` (usado pelo plugin `@fastify/cookie` para assinar os cookies HttpOnly; pode ser o mesmo `JWT_SECRET`).

## Configuração rápida
```
npm install            # instala dependências
# (opcional) adapte seu .env com DATABASE_URL/JWT_SECRET
npm run dev            # executa o projeto em modo watch (tsx)
```
Use `docker compose up -d postgres` para subir o banco se desejar o ambiente completo.

## Banco de dados
Execute os comandos Prisma após conectar ao banco:
```
npx prisma generate
npx prisma migrate dev --name add-user-model
npx prisma migrate dev --name link-product-user
```
As duas migrations (`20260312212127_add_user_model` e `20260313120000_link_product_user`) criam o modelo `User`, vinculam `Product` a `User` e adicionam constraints.

## Scripts úteis
| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com `tsx watch --env-file .env src/server.ts`. |
| `npm run build` | Compila o TypeScript para `dist/` via `tsc`. |
| `npm start` | Executa o build compilado (`node dist/server.js`). |
| `npm run test` | Placeholder (retorna erro). |

## Principais endpoints
### Autenticação
| Método | Rota | Observações |
| --- | --- | --- |
| `POST /auth/register` | Corpo: `{ name, email, password, confirmPassword }`.<br>Resposta: `{ user, accessToken, refreshToken }` e dois cookies HttpOnly (`auth_token` e `refresh_token`) com os mesmos tokens.<br>Valida senha/confirmPassword e armazena `refreshToken` no banco. |
| `POST /auth/login` | Corpo: `{ email, password }`. Retorna `{ user, accessToken, refreshToken }` e os cookies `auth_token`/`refresh_token` (HttpOnly/`sameSite=lax`). |
| `GET /auth/me` | Header `Authorization: Bearer <token>` ou cookie `auth_token`. Retorna o usuário autenticado. |

### Produtos
| Método | Rota | Requisitos | Retorno |
| --- | --- | --- | --- |
| `GET /products` | Lista todos os produtos. Resposta: `{ data: Product[] }`. |
| `GET /products/:id` | Busca um produto. Retorno: `{ data: Product }`. |
| `POST /products` | Autenticação obrigatória.<br>Body: `{ name, price }`.<br>Cria produto atrelado ao usuário e retorna `{ data: Product }`. |
| `PUT /products/:id` | Autenticação obrigatória.<br>Só o dono ou um ADMIN (`request.user.role`) pode atualizar. Body obrigatório `{ name, price }`. |
| `DELETE /products/:id` | Autenticação obrigatória e verificação de dono/ADMIN. Retorna 204. |

Os responses de produto incluem o campo `user` (sem senha), conforme `productResponseSchema` e `userResponseSchema`.

### Usuários (apenas ADMIN)
Todas as rotas abaixo usam o middleware `authMiddleware` + `adminMiddleware`.
| Método | Rota | Descrição |
| --- | --- | --- |
| `GET /users` | Lista usuários (`userListResponseSchema`). |
| `GET /users/:id` | Retorna o usuário informado. |
| `PATCH /users/:id` | Atualiza `name`, `email`, `password`, `role`. Senha é hashada. |
| `DELETE /users/:id` | Remove o usuário (204). |

## Segurança e middleware
- `authMiddleware` aceita o cabeçalho `Authorization: Bearer <token>` ou o cookie `auth_token` HttpOnly (setado em `auth.controller.ts`), sempre populando `request.user` com `{ id, role }`.
- `adminMiddleware` garante que o usuário tenha `role === "ADMIN"`.
- `ProductsService` valida existência do produto e checa se quem altera/exclui é o dono ou ADMIN. `UsersService` lança `NotFoundError` quando falta o registro.
- `src/errors/http-errors.ts` define `AuthenticationError`, `ForbiddenError`, `NotFoundError`; o server mapeia essas classes para respostas 401/403/404.
- O handler global também trata `PrismaClientKnownRequestError` com código `P2025` como 404 e registra erros no `request.log` antes de responder 500.
- O plugin `@fastify/cookie` carrega as opções de cookie em `src/config/cookies.ts`, garantindo `httpOnly`, `secure` em produção, `sameSite=lax` e `path="/"` para os cookies `auth_token` (15 minutos) e `refresh_token` (7 dias).

## Documentação e testes manuais
- Documentação OpenAPI gerada automaticamente e publicada em `/docs` (inclui tags `Auth`, `Products`, `Users` e esquema `BearerAuth`).
- Use o Swagger UI para testar JWTs (botão `Authorize` para preencher o token de acesso).

## Observações finais
- A aplicação usa `UserRole` (`USER | ADMIN`) em todo stack (`auth.service.ts`, `products.services.ts`, `users.service.ts`).
- Os tokens são gerados em `src/lib/jwt.ts` e o `refreshToken` é persistido no usuário após cada login/registro.
- Para colocar em produção, configure `JWT_SECRET` forte, rode `npm run build` e execute `NODE_ENV=production npm start`.
