# Atual Diesel — Sistema de Gestão

Sistema de gestão interno para a oficina Atual Diesel: clientes, veículos, serviços, checklist de entrada, ordens de serviço e dashboard.

## Stack

- **Backend**: NestJS + TypeScript + Prisma, autenticação e storage de fotos via **Supabase**
- **Frontend**: React + Vite + TypeScript + Mantine
- **Banco de dados**: PostgreSQL (Supabase)
- **Deploy**: Vercel (frontend + backend serverless)

## Estrutura

```
backend/   API NestJS (Prisma + Supabase Auth + geração de PDF)
frontend/  SPA React (Vite + Mantine + React Query)
```

## Configuração inicial

### 1. Supabase

No projeto Supabase já existente:

1. Copie a **Connection string** (Settings → Database) para preencher `DATABASE_URL` e `DIRECT_URL` no `backend/.env`.
2. Em Settings → API, copie `URL`, `anon public key` e `service_role key`.
3. Em Settings → API → JWT Settings, copie o **JWT Secret** para `SUPABASE_JWT_SECRET`.
4. Crie um bucket de Storage chamado `checklist-photos` (público para leitura, upload autenticado).

### 2. Backend

```bash
cd backend
cp .env.example .env   # preencha com os dados do Supabase
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

O primeiro usuário administrador precisa ser criado manualmente: crie o login no Supabase Auth (painel → Authentication → Users, ou via Admin API) e depois insira o registro correspondente na tabela `profiles` com `papel = ADMIN` (mesmo `id` do usuário criado).

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # preencha VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm install
npm run dev
```

## Deploy (Vercel)

- **Backend**: importar a pasta `backend` como projeto Vercel. Build command: `npm run build` (já configurado em `vercel.json`). Configurar as variáveis de ambiente do `.env.example` no painel da Vercel.
- **Frontend**: importar a pasta `frontend` como projeto Vercel (detecção automática de Vite). Configurar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_API_URL` (apontando para a URL do backend na Vercel).
- Apontar o subdomínio desejado (ex: `sistema.atualdiesel.com.br`) via CNAME na Hostinger para o domínio gerado pela Vercel.
