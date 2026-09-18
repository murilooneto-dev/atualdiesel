-- CreateEnum
CREATE TYPE "AuditAcao" AS ENUM ('CRIACAO', 'ATUALIZACAO', 'EXCLUSAO');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT,
    "acao" "AuditAcao" NOT NULL,
    "usuario_id" UUID,
    "detalhes" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_entidade_entidade_id_idx" ON "audit_logs"("entidade", "entidade_id");

-- CreateIndex
CREATE INDEX "audit_logs_criado_em_idx" ON "audit_logs"("criado_em");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
