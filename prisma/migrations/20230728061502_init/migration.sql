-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DRINK', 'FOOD');

-- CreateEnum
CREATE TYPE "SubCategory" AS ENUM ('SANDWICH', 'WRAP', 'BURGER', 'SWEETS', 'SPECIALS', 'ESPRESSO', 'FRESH_JUICE', 'ICED', 'ALCOHOL', 'SMOOTHIES');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "address_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "expectedDeliveryTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "review" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "CoffeeProduct" (
    "coffee_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity_available" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CoffeeProduct_pkey" PRIMARY KEY ("coffee_id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotel_id" SERIAL NOT NULL,
    "admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "lastMonthOrders" INTEGER NOT NULL,
    "ThisWeekOrders" INTEGER NOT NULL,
    "startingWorkingTime" TIMESTAMP(3) NOT NULL,
    "endingWorkingTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "address_id" TEXT NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "village" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "categories" "Category"[],

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "menuItem_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "menuMenu_id" INTEGER,
    "price" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "sub_category" "SubCategory" NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("menuItem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_id_key" ON "Order"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_product_id_key" ON "Order"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeProduct_coffee_id_key" ON "CoffeeProduct"("coffee_id");

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeProduct_order_id_key" ON "CoffeeProduct"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_hotel_id_key" ON "Hotel"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_admin_id_key" ON "Hotel"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_menu_id_key" ON "Hotel"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_hotel_id_key" ON "Address"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_menu_id_key" ON "Menu"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_hotel_id_key" ON "Menu"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menuItem_id_key" ON "MenuItem"("menuItem_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "CoffeeProduct"("coffee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeProduct" ADD CONSTRAINT "CoffeeProduct_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuMenu_id_fkey" FOREIGN KEY ("menuMenu_id") REFERENCES "Menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;
