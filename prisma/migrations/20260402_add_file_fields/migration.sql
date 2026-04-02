-- AlterTable
ALTER TABLE "meal_plans" ADD COLUMN IF NOT EXISTS "file_url" TEXT,
ADD COLUMN IF NOT EXISTS "file_name" TEXT;

-- AlterTable
ALTER TABLE "workout_plans" ADD COLUMN IF NOT EXISTS "file_url" TEXT,
ADD COLUMN IF NOT EXISTS "file_name" TEXT;

-- AlterTable
ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "file_name" TEXT;
