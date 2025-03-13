-- CreateTable
CREATE TABLE "sekolah" (
    "id_sekolah" SERIAL NOT NULL,
    "nama_sekolah" TEXT NOT NULL,
    "alamat" TEXT,
    "no_telepon" TEXT,
    "kode_pos" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("id_sekolah")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id_kelas" SERIAL NOT NULL,
    "kelas" TEXT NOT NULL,
    "id_sekolah" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id_kelas")
);

-- CreateTable
CREATE TABLE "guru" (
    "id_guru" SERIAL NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "nip" TEXT,
    "id_sekolah" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id_guru")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id_siswa" SERIAL NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "no_absen" TEXT NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id_siswa")
);

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "id_guru" INTEGER,
    "id_siswa" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "register_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "materi" (
    "id_materi" SERIAL NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_base_64" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3),
    "update_by" INTEGER,

    CONSTRAINT "materi_pkey" PRIMARY KEY ("id_materi")
);

-- CreateTable
CREATE TABLE "proyek" (
    "id_proyek" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "id_kelas" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "proyek_pkey" PRIMARY KEY ("id_proyek")
);

-- CreateTable
CREATE TABLE "kelompok_proyek" (
    "id_kelompok_proyek" SERIAL NOT NULL,
    "kelompok_proyek" TEXT NOT NULL,
    "id_proyek" INTEGER NOT NULL,
    "hasil" TEXT NOT NULL,
    "nilai_pertemuan_1" DOUBLE PRECISION,
    "nilai_pertemuan_2" DOUBLE PRECISION,
    "nilai_pertemuan_3" DOUBLE PRECISION,
    "nilai_pertemuan_4" DOUBLE PRECISION,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3),
    "update_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "appresiasi" TEXT DEFAULT '',

    CONSTRAINT "kelompok_proyek_pkey" PRIMARY KEY ("id_kelompok_proyek")
);

-- CreateTable
CREATE TABLE "siswa_kelompok_proyek" (
    "id_siswa_kelompok_proyek" SERIAL NOT NULL,
    "id_kelompok_proyek" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,

    CONSTRAINT "siswa_kelompok_proyek_pkey" PRIMARY KEY ("id_siswa_kelompok_proyek")
);

-- CreateTable
CREATE TABLE "kuis" (
    "id_kuis" SERIAL NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "kategori_kuis" TEXT NOT NULL,
    "deskripsi" TEXT,
    "type" TEXT DEFAULT 'essai',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3),
    "update_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "kuis_pkey" PRIMARY KEY ("id_kuis")
);

-- CreateTable
CREATE TABLE "pertanyaan_kuis" (
    "id_pertanyaan" SERIAL NOT NULL,
    "id_kuis" INTEGER NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,

    CONSTRAINT "pertanyaan_kuis_pkey" PRIMARY KEY ("id_pertanyaan")
);

-- CreateTable
CREATE TABLE "jawaban_kuis" (
    "id_jawaban" SERIAL NOT NULL,
    "id_pertanyaan" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "jawaban" TEXT NOT NULL,
    "is_correct" BOOLEAN,
    "submit_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jawaban_kuis_pkey" PRIMARY KEY ("id_jawaban")
);

-- CreateTable
CREATE TABLE "nilai_kuis" (
    "id_nilai_kuis" SERIAL NOT NULL,
    "id_kuis" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "nilai" DECIMAL(65,30) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,

    CONSTRAINT "nilai_kuis_pkey" PRIMARY KEY ("id_nilai_kuis")
);

-- CreateTable
CREATE TABLE "referensi" (
    "id_referensi" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "link" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,

    CONSTRAINT "referensi_pkey" PRIMARY KEY ("id_referensi")
);

-- CreateTable
CREATE TABLE "simulasi" (
    "id_simulasi" SERIAL NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "petunjuk_pengerjaan" TEXT NOT NULL,
    "bahan_dan_alat" TEXT NOT NULL,
    "hasil_yang_diharapkan" TEXT NOT NULL,
    "ilustrasi" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3),
    "update_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "simulasi_pkey" PRIMARY KEY ("id_simulasi")
);

-- CreateTable
CREATE TABLE "jawaban_simulasi" (
    "id_jawaban_simulasi" SERIAL NOT NULL,
    "id_simulasi" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "untuk" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "waktu" TEXT NOT NULL,
    "dari" TEXT NOT NULL,
    "perusahaan" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "isi_pesan" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "nama_penerima" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL DEFAULT 0,
    "link_video_youtube" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3),
    "update_by" INTEGER,

    CONSTRAINT "jawaban_simulasi_pkey" PRIMARY KEY ("id_jawaban_simulasi")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_siswa_key" ON "user"("id_siswa");

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id_sekolah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id_sekolah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi" ADD CONSTRAINT "materi_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyek" ADD CONSTRAINT "proyek_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_proyek" ADD CONSTRAINT "kelompok_proyek_id_proyek_fkey" FOREIGN KEY ("id_proyek") REFERENCES "proyek"("id_proyek") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_kelompok_proyek" ADD CONSTRAINT "siswa_kelompok_proyek_id_kelompok_proyek_fkey" FOREIGN KEY ("id_kelompok_proyek") REFERENCES "kelompok_proyek"("id_kelompok_proyek") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_kelompok_proyek" ADD CONSTRAINT "siswa_kelompok_proyek_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_kelompok_proyek" ADD CONSTRAINT "siswa_kelompok_proyek_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kuis" ADD CONSTRAINT "kuis_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pertanyaan_kuis" ADD CONSTRAINT "pertanyaan_kuis_id_kuis_fkey" FOREIGN KEY ("id_kuis") REFERENCES "kuis"("id_kuis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_kuis" ADD CONSTRAINT "jawaban_kuis_id_pertanyaan_fkey" FOREIGN KEY ("id_pertanyaan") REFERENCES "pertanyaan_kuis"("id_pertanyaan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_kuis" ADD CONSTRAINT "jawaban_kuis_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_kuis" ADD CONSTRAINT "nilai_kuis_id_kuis_fkey" FOREIGN KEY ("id_kuis") REFERENCES "kuis"("id_kuis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_kuis" ADD CONSTRAINT "nilai_kuis_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulasi" ADD CONSTRAINT "simulasi_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_simulasi" ADD CONSTRAINT "jawaban_simulasi_id_simulasi_fkey" FOREIGN KEY ("id_simulasi") REFERENCES "simulasi"("id_simulasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_simulasi" ADD CONSTRAINT "jawaban_simulasi_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;
