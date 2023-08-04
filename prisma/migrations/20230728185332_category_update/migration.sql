/*
  Warnings:

  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_category_id_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "subcategories" TEXT[];

-- DropTable
DROP TABLE "SubCategory";
