-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_admin_id_fkey";

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
