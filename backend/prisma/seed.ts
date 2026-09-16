import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultChecklistItems = [
  { nome: 'Pneus', categoria: 'Externo' },
  { nome: 'Freios', categoria: 'Mecânica' },
  { nome: 'Nível de óleo', categoria: 'Fluidos' },
  { nome: 'Nível de água do radiador', categoria: 'Fluidos' },
  { nome: 'Bateria', categoria: 'Elétrica' },
  { nome: 'Faróis e lanternas', categoria: 'Elétrica' },
  { nome: 'Para-brisa e vidros', categoria: 'Externo' },
  { nome: 'Estepe e macaco', categoria: 'Externo' },
  { nome: 'Itens internos (rádio, ar-condicionado)', categoria: 'Interno' },
  { nome: 'Documentação do veículo', categoria: 'Documentação' },
];

async function main() {
  for (const item of defaultChecklistItems) {
    const exists = await prisma.checklistItemType.findFirst({ where: { nome: item.nome } });
    if (!exists) {
      await prisma.checklistItemType.create({ data: item });
    }
  }

  console.log('Seed concluído: tipos de checklist padrão cadastrados.');
  console.log(
    'Para criar o primeiro usuário administrador, crie o login no Supabase Auth (painel ou Admin API) e insira o registro correspondente na tabela "profiles" com papel = ADMIN.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
