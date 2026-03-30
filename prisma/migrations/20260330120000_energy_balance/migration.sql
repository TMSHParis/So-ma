-- Enum équilibre énergétique + champs objectifs caloriques avancés
CREATE TYPE "EnergyBalance" AS ENUM ('DEFICIT', 'MAINTENANCE', 'SURPLUS');

ALTER TABLE "clients" ADD COLUMN "maintenance_calories" INTEGER;
ALTER TABLE "clients" ADD COLUMN "energy_balance" "EnergyBalance";
ALTER TABLE "clients" ADD COLUMN "caloric_delta_kcal" INTEGER NOT NULL DEFAULT 0;
