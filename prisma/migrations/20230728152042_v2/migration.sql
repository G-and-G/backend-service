/*
  Warnings:

  - The primary key for the `Hotel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `hotel_id` column on the `Hotel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CoffeeProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[menu_id]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `hotel_id` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `image` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_id` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `product_id` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "CoffeeProduct" DROP CONSTRAINT "CoffeeProduct_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_id_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "hotel_id",
ADD COLUMN     "hotel_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_pkey",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "menu_id" INTEGER NOT NULL,
DROP COLUMN "hotel_id",
ADD COLUMN     "hotel_id" SERIAL NOT NULL,
ADD CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotel_id");

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "product_id",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CoffeeProduct";

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "menuItem_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "Menu_id" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "quantity_available" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("menuItem_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "subcategory_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("subcategory_id")
);

-- CreateTable
CREATE TABLE "_CategoryToMenu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_menu_id_key" ON "Menu"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_hotel_id_key" ON "Menu"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menuItem_id_key" ON "MenuItem"("menuItem_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_id_key" ON "Category"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_subcategory_id_key" ON "SubCategory"("subcategory_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMenu_AB_unique" ON "_CategoryToMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMenu_B_index" ON "_CategoryToMenu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Address_hotel_id_key" ON "Address"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_hotel_id_key" ON "Hotel"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_menu_id_key" ON "Hotel"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_product_id_key" ON "Order"("product_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "MenuItem"("menuItem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_Menu_id_fkey" FOREIGN KEY ("Menu_id") REFERENCES "Menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "SubCategory"("subcategory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenu" ADD CONSTRAINT "_CategoryToMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenu" ADD CONSTRAINT "_CategoryToMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;
