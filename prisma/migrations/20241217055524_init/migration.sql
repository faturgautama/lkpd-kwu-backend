/*
  Warnings:

  - You are about to drop the `TumblerLogDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TumblerLogDetail";

-- CreateTable
CREATE TABLE "TumblerFillLog" (
    "id_tumbler_fill_log" SERIAL NOT NULL,
    "id_tumbler_log" INTEGER NOT NULL,
    "litre" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TumblerFillLog_pkey" PRIMARY KEY ("id_tumbler_fill_log")
);

-- CreateTable
CREATE TABLE "TumblerConsumeLog" (
    "id_tumbler_log_detail" SERIAL NOT NULL,
    "id_tumbler_log" INTEGER NOT NULL,
    "litre" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TumblerConsumeLog_pkey" PRIMARY KEY ("id_tumbler_log_detail")
);
