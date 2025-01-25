/*
  Warnings:

  - You are about to drop the column `id_user` on the `jawaban_kuis` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `nilai_kuis` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_siswa]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_siswa` to the `jawaban_kuis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_siswa` to the `nilai_kuis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "jawaban_kuis" DROP CONSTRAINT "jawaban_kuis_id_user_fkey";

-- DropForeignKey
ALTER TABLE "nilai_kuis" DROP CONSTRAINT "nilai_kuis_id_user_fkey";

-- AlterTable
ALTER TABLE "jawaban_kuis" DROP COLUMN "id_user",
ADD COLUMN     "id_siswa" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "nilai_kuis" DROP COLUMN "id_user",
ADD COLUMN     "id_siswa" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_siswa_key" ON "user"("id_siswa");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_kuis" ADD CONSTRAINT "jawaban_kuis_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_kuis" ADD CONSTRAINT "nilai_kuis_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;
