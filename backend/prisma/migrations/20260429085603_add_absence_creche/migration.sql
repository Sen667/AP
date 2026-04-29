-- CreateTable
CREATE TABLE "absences_creche" (
    "id" SERIAL NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "motif" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absences_creche_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "absences_creche_inscriptionId_idx" ON "absences_creche"("inscriptionId");

-- CreateIndex
CREATE INDEX "absences_creche_dateDebut_idx" ON "absences_creche"("dateDebut");

-- AddForeignKey
ALTER TABLE "absences_creche" ADD CONSTRAINT "absences_creche_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "inscriptions_creche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
