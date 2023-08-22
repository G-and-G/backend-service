-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menu_id_fkey";

-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "menu_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;
