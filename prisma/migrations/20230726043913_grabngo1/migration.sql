-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

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
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity_available" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CoffeeProduct_pkey" PRIMARY KEY ("coffee_id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotel_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
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
    "hotel_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "village" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

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
CREATE UNIQUE INDEX "Address_hotel_id_key" ON "Address"("hotel_id");

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
