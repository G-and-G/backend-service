/*
  Warnings:

  - You are about to drop the column `subcategories` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToMenu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CATTYPE" AS ENUM ('FOOD', 'DRINK');

-- DropForeignKey
ALTER TABLE "_CategoryToMenu" DROP CONSTRAINT "_CategoryToMenu_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToMenu" DROP CONSTRAINT "_CategoryToMenu_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "subcategories",
ADD COLUMN     "menu_id" INTEGER,
ADD COLUMN     "type" "CATTYPE" NOT NULL;

-- DropTable
DROP TABLE "_CategoryToMenu";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;
