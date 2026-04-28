/*
  Warnings:

  - You are about to drop the `Historique` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Historique" DROP CONSTRAINT "Historique_modifieParParentId_fkey";

-- DropForeignKey
ALTER TABLE "Historique" DROP CONSTRAINT "Historique_suiviGardeAssistantId_fkey";

-- DropTable
DROP TABLE "Historique";

-- CreateTable
CREATE TABLE "historiques" (
    "id" SERIAL NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "modifieParParentId" INTEGER,
    "action" "TypeAction" NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    "suiviGardeAssistantId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historiques_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historiques_entityType_entityId_idx" ON "historiques"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "historiques" ADD CONSTRAINT "historiques_modifieParParentId_fkey" FOREIGN KEY ("modifieParParentId") REFERENCES "parents_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiques" ADD CONSTRAINT "historiques_suiviGardeAssistantId_fkey" FOREIGN KEY ("suiviGardeAssistantId") REFERENCES "suivis_garde_assistants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
