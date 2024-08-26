/*
  Warnings:

  - Added the required column `updated_at` to the `DeriveryAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeriveryAddress" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
