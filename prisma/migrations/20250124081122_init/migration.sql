/*
  Warnings:

  - You are about to drop the column `create_at` on the `jawaban_kuis` table. All the data in the column will be lost.
  - Added the required column `is_correct` to the `jawaban_kuis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jawaban_kuis" DROP COLUMN "create_at",
ADD COLUMN     "is_correct" BOOLEAN NOT NULL,
ADD COLUMN     "submit_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "kuis" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);
