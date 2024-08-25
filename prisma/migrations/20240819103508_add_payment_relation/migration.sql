/*
  Warnings:

  - A unique constraint covering the columns `[flutterwave_txn_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_flutterwave_txn_id_key" ON "Payment"("flutterwave_txn_id");
