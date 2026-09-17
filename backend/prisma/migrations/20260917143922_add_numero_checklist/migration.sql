-- AlterTable
ALTER TABLE "entry_checklists" ADD COLUMN "numero_checklist" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "entry_checklists_numero_checklist_key" ON "entry_checklists"("numero_checklist");
