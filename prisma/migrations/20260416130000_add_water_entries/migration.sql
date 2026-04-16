-- CreateTable
CREATE TABLE "water_entries" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "water_entries_client_id_date_idx" ON "water_entries"("client_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "water_entries_client_id_date_key" ON "water_entries"("client_id", "date");

-- AddForeignKey
ALTER TABLE "water_entries" ADD CONSTRAINT "water_entries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
