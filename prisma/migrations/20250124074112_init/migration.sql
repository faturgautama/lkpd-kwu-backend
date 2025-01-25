/*
  Warnings:

  - Added the required column `judul` to the `kuis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kuis" ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "judul" TEXT NOT NULL;
