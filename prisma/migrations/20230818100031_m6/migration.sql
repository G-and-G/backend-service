-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_hotel_id_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "hotel_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE SET NULL ON UPDATE CASCADE;
