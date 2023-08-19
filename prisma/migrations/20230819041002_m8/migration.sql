/*
  Warnings:

  - You are about to drop the column `menu_id` on the `Hotel` table. All the data in the column will be lost.
  - Made the column `hotel_id` on table `Menu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `menu_id` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menu_id_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "menu_id";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "hotel_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "menu_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;
