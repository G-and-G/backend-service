/*
  Warnings:

  - You are about to drop the column `endingWorkingTime` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the `_HotelToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "_HotelToUser" DROP CONSTRAINT "_HotelToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_HotelToUser" DROP CONSTRAINT "_HotelToUser_B_fkey";

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "endingWorkingTime",
ADD COLUMN     "closingTime" TEXT NOT NULL DEFAULT '22:00',
ALTER COLUMN "startingWorkingTime" DROP DEFAULT,
ALTER COLUMN "startingWorkingTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hotelId" INTEGER,
ADD COLUMN     "phone_number" TEXT;

-- DropTable
DROP TABLE "_HotelToUser";

-- CreateTable
CREATE TABLE "hotel_invites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_name_key" ON "sub_categories"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_invites" ADD CONSTRAINT "hotel_invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_invites" ADD CONSTRAINT "hotel_invites_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
