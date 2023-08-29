/*
  Warnings:

  - Made the column `menu_id` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menu_id_fkey";

-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "menu_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;
