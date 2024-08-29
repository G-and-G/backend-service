/*
  Warnings:

  - You are about to drop the column `admin_id` on the `hotels` table. All the data in the column will be lost.
  - Changed the type of `longitude` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `latitude` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DELIVERED';

-- DropForeignKey
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_admin_id_fkey";

-- DropIndex
DROP INDEX "hotels_admin_id_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "longitude",
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "admin_id";

-- CreateTable
CREATE TABLE "_HotelToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HotelToUser_AB_unique" ON "_HotelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_HotelToUser_B_index" ON "_HotelToUser"("B");

-- AddForeignKey
ALTER TABLE "_HotelToUser" ADD CONSTRAINT "_HotelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToUser" ADD CONSTRAINT "_HotelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
