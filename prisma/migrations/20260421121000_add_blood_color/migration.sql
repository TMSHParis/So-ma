-- CreateEnum
CREATE TYPE "BloodColor" AS ENUM ('ROUGE_VIF', 'POURPRE', 'MARRON_CLAIR', 'MARRON_FONCE', 'NOIR');

-- AlterTable
ALTER TABLE "cycle_entries" ADD COLUMN "blood_color" "BloodColor";
