/*
  Warnings:

  - Added the required column `latitude` to the `DeriveryAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `DeriveryAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `DeriveryAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeriveryAddress" ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "plateNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliverer_id" TEXT;

-- CreateTable
CREATE TABLE "Deliverer" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deliverer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deliverer_user_id_key" ON "Deliverer"("user_id");

-- AddForeignKey
ALTER TABLE "Deliverer" ADD CONSTRAINT "Deliverer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "Deliverer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
