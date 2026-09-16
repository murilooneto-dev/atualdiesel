import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient, Role } from '@prisma/client';

const [, , email, password, nome] = process.argv;

if (!email || !password) {
  console.error('Uso: npm run create-admin -- <email> <senha> [nome]');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidos no .env');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const prisma = new PrismaClient();

async function main() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Falha ao criar usuário no Supabase Auth.');
  }

  await prisma.profile.create({
    data: {
      id: data.user.id,
      nome: nome ?? 'Administrador',
      email,
      papel: Role.ADMIN,
      ativo: true,
    },
  });

  console.log(`Usuário administrador criado com sucesso: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
