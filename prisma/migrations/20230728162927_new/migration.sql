/*
  Warnings:

  - You are about to drop the column `Menu_id` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_id` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_Menu_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_subcategory_id_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "Menu_id",
DROP COLUMN "subcategory_id",
ADD COLUMN     "menu_id" INTEGER;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;
