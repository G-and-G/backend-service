/*
  Warnings:

  - You are about to drop the column `expectedDeliveryTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_id_fkey";

-- DropIndex
DROP INDEX "Order_customer_id_key";

-- DropIndex
DROP INDEX "Order_product_id_key";

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "order_id" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "expectedDeliveryTime",
DROP COLUMN "product_id",
ALTER COLUMN "review" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_order_id_key" ON "MenuItem"("order_id");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
