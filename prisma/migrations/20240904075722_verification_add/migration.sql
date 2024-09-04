/*
  Warnings:

  - A unique constraint covering the columns `[verification_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verification_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_verifications" DROP CONSTRAINT "user_verifications_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verification_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_id_key" ON "users"("verification_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_verification_id_fkey" FOREIGN KEY ("verification_id") REFERENCES "user_verifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
