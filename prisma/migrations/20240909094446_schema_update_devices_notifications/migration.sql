-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('IOS', 'ANDROID');

-- DropIndex
DROP INDEX "assigned_orders_user_id_key";

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oneSignalPlayerId" TEXT NOT NULL,
    "deviceType" "DeviceType",
    "deviceName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_oneSignalPlayerId_key" ON "Device"("oneSignalPlayerId");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
