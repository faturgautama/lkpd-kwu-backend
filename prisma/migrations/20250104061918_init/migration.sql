/*
  Warnings:

  - Changed the type of `id_unit` on the `SamImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SamImage" DROP COLUMN "id_unit",
ADD COLUMN     "id_unit" INTEGER NOT NULL;
