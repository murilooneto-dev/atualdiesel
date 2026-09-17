import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checklistItems = [
  // Parte externa / interior
  { nome: 'Para-choque', categoria: 'Externa / interior' },
  { nome: 'Grades, molduras e emblemas', categoria: 'Externa / interior' },
  { nome: 'Capô / tampa frontal', categoria: 'Externa / interior' },
  { nome: 'Farol, lanternas, setas e refletores', categoria: 'Externa / interior' },
  { nome: 'Para-lamas, estribos e suporte', categoria: 'Externa / interior' },
  { nome: 'Portas, maçanetas, fechaduras e dobradiças', categoria: 'Externa / interior' },
  { nome: 'Vidros, para-brisas e espelho retrovisor', categoria: 'Externa / interior' },
  { nome: 'Teto ou escotilha', categoria: 'Externa / interior' },
  { nome: 'Pintura – riscos, amassados, descascado, diferença de tonalidade', categoria: 'Externa / interior' },
  { nome: 'Adesivos, identificação e acessórios externos', categoria: 'Externa / interior' },
  { nome: 'Bancos – rasgos, manchas, desgaste ou danos', categoria: 'Externa / interior' },
  { nome: 'Cintos de segurança e travas', categoria: 'Externa / interior' },
  { nome: 'Painel, acabamento e forrações', categoria: 'Externa / interior' },
  { nome: 'Volante e alavancas', categoria: 'Externa / interior' },
  { nome: 'Tapetes e assoalho', categoria: 'Externa / interior' },
  { nome: 'Porta-objetos e porta-luvas', categoria: 'Externa / interior' },
  { nome: 'Ar-condicionado / climatização', categoria: 'Externa / interior' },
  { nome: 'Rádio, multimídia e acessórios', categoria: 'Externa / interior' },
  // Parte elétrica / mecânica
  { nome: 'Vidros e comandos elétricos', categoria: 'Elétrica / mecânica' },
  { nome: 'Tomadas, carregadores e objetos deixados no veículo', categoria: 'Elétrica / mecânica' },
  { nome: 'Quilometragem registrada', categoria: 'Elétrica / mecânica' },
  { nome: 'Nível de combustível registrado', categoria: 'Elétrica / mecânica' },
  { nome: 'Luzes de advertência no painel', categoria: 'Elétrica / mecânica' },
  { nome: 'Indicadores e instrumentos', categoria: 'Elétrica / mecânica' },
  { nome: 'Buzina', categoria: 'Elétrica / mecânica' },
  { nome: 'Limpadores e lavadores de para-brisa', categoria: 'Elétrica / mecânica' },
  { nome: 'Iluminação interna', categoria: 'Elétrica / mecânica' },
  { nome: 'Câmera / sensores / acessórios eletrônicos', categoria: 'Elétrica / mecânica' },
  { nome: 'Pneus – desgaste, cortes, bolhas e estado geral', categoria: 'Elétrica / mecânica' },
  { nome: 'Rodas e porcas', categoria: 'Elétrica / mecânica' },
  { nome: 'Estepe / suporte de estepe', categoria: 'Elétrica / mecânica' },
  { nome: 'Suspensão visível e componentes aparentes', categoria: 'Elétrica / mecânica' },
  { nome: 'Vazamentos aparentes de óleo, água, combustível ou outros', categoria: 'Elétrica / mecânica' },
  { nome: 'Mangueiras, conexões e reservatórios aparentes', categoria: 'Elétrica / mecânica' },
  { nome: 'Bateria e terminais', categoria: 'Elétrica / mecânica' },
  { nome: 'Chassi / componentes aparentes com avarias', categoria: 'Elétrica / mecânica' },
];

async function main() {
  for (const item of checklistItems) {
    const exists = await prisma.checklistItemType.findFirst({ where: { nome: item.nome } });
    if (!exists) {
      await prisma.checklistItemType.create({ data: item });
    }
  }

  console.log('Seed concluído: tipos de checklist de entrada cadastrados.');
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
