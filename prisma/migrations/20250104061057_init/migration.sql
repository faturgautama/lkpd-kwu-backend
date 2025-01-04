-- CreateTable
CREATE TABLE "SamUnit" (
    "id" SERIAL NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "merk" TEXT NOT NULL,
    "ukuran" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SamUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SamImage" (
    "id" SERIAL NOT NULL,
    "id_unit" TEXT NOT NULL,
    "path_foto" TEXT NOT NULL,

    CONSTRAINT "SamImage_pkey" PRIMARY KEY ("id")
);
