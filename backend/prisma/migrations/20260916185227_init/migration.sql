-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GERENTE', 'MECANICO');

-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "Combustivel" AS ENUM ('GASOLINA', 'ETANOL', 'FLEX', 'DIESEL', 'GNV', 'ELETRICO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "StatusChecklistItem" AS ENUM ('OK', 'ATENCAO', 'NAO_APLICAVEL');

-- CreateEnum
CREATE TYPE "NivelCombustivel" AS ENUM ('RESERVA', 'UM_QUARTO', 'METADE', 'TRES_QUARTOS', 'CHEIO');

-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'AGUARDANDO_APROVACAO', 'AGUARDANDO_PECA', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "papel" "Role" NOT NULL DEFAULT 'MECANICO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo_pessoa" "TipoPessoa" NOT NULL DEFAULT 'PF',
    "cpf_cnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "cep" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER,
    "cor" TEXT,
    "quilometragem_atual" INTEGER,
    "combustivel" "Combustivel" NOT NULL DEFAULT 'FLEX',
    "chassi" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor_padrao" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_item_types" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "checklist_item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_checklists" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "quilometragem" INTEGER NOT NULL,
    "nivel_combustivel" "NivelCombustivel" NOT NULL,
    "observacoes_gerais" TEXT,
    "criado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entry_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_checklist_items" (
    "id" UUID NOT NULL,
    "entry_checklist_id" UUID NOT NULL,
    "checklist_item_type_id" UUID NOT NULL,
    "status" "StatusChecklistItem" NOT NULL DEFAULT 'OK',
    "observacao" TEXT,

    CONSTRAINT "entry_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_checklist_photos" (
    "id" UUID NOT NULL,
    "entry_checklist_id" UUID NOT NULL,
    "url_storage" TEXT NOT NULL,
    "descricao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entry_checklist_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders" (
    "id" UUID NOT NULL,
    "numero_os" SERIAL NOT NULL,
    "client_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "entry_checklist_id" UUID,
    "status" "StatusOS" NOT NULL DEFAULT 'ABERTA',
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_previsao" TIMESTAMP(3),
    "data_conclusao" TIMESTAMP(3),
    "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "criado_por" UUID NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_order_items" (
    "id" UUID NOT NULL,
    "service_order_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "valor_unitario" DECIMAL(10,2) NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "service_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_order_status_history" (
    "id" UUID NOT NULL,
    "service_order_id" UUID NOT NULL,
    "status_anterior" "StatusOS",
    "status_novo" "StatusOS" NOT NULL,
    "alterado_por" UUID NOT NULL,
    "alterado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,

    CONSTRAINT "service_order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "service_orders_numero_os_key" ON "service_orders"("numero_os");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_checklists" ADD CONSTRAINT "entry_checklists_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_checklists" ADD CONSTRAINT "entry_checklists_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_checklist_items" ADD CONSTRAINT "entry_checklist_items_entry_checklist_id_fkey" FOREIGN KEY ("entry_checklist_id") REFERENCES "entry_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_checklist_items" ADD CONSTRAINT "entry_checklist_items_checklist_item_type_id_fkey" FOREIGN KEY ("checklist_item_type_id") REFERENCES "checklist_item_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_checklist_photos" ADD CONSTRAINT "entry_checklist_photos_entry_checklist_id_fkey" FOREIGN KEY ("entry_checklist_id") REFERENCES "entry_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_entry_checklist_id_fkey" FOREIGN KEY ("entry_checklist_id") REFERENCES "entry_checklists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_items" ADD CONSTRAINT "service_order_items_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_items" ADD CONSTRAINT "service_order_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_status_history" ADD CONSTRAINT "service_order_status_history_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_status_history" ADD CONSTRAINT "service_order_status_history_alterado_por_fkey" FOREIGN KEY ("alterado_por") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
