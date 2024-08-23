/*
  Warnings:

  - You are about to drop the column `order_id` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_order_id_fkey";

-- DropIndex
DROP INDEX "MenuItem_order_id_key";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "order_id";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menuItem_id" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartItemToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CartItemToOrder_AB_unique" ON "_CartItemToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_CartItemToOrder_B_index" ON "_CartItemToOrder"("B");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_menuItem_id_fkey" FOREIGN KEY ("menuItem_id") REFERENCES "MenuItem"("menuItem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemToOrder" ADD CONSTRAINT "_CartItemToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemToOrder" ADD CONSTRAINT "_CartItemToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
