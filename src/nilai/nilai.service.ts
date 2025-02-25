import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NilaiModel } from './nilai.model';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NilaiService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(id_kelas: number): Promise<NilaiModel.GetNilaiByKelas> {
        try {
            const siswa = await this._prismaService
                .siswa
                .findMany({
                    where: {
                        id_kelas: parseInt(id_kelas as any)
                    },
                    include: {
                        kelas: {
                            select: {
                                kelas: true
                            }
                        }
                    },
                    orderBy: {
                        id_siswa: 'asc',
                    }
                });

            let siswaArr = siswa.map((item) => {
                return {
                    id_siswa: item.id_siswa,
                    no_absen: item.no_absen,
                    nama_lengkap: item.nama_lengkap,
                    id_kelas: item.id_kelas,
                    kelas: item.kelas.kelas,
                    proyek: [],
                    kuis: [],
                }
            });

            for (const item of siswaArr) {
                item.proyek = await this._prismaService.$queryRaw`
                    SELECT 
                        pry.id_proyek,
                        pry.judul,
                        klp.kelompok_proyek,
                        klp.nilai_pertemuan_1,
                        klp.nilai_pertemuan_2,
                        klp.nilai_pertemuan_3,
                        klp.nilai_pertemuan_4,
                        klp.appresiasi,
                        pry.create_at
                    FROM 
                        siswa_kelompok_proyek skp
                    LEFT JOIN 
                        kelompok_proyek klp ON klp.id_kelompok_proyek = skp.id_kelompok_proyek
                    LEFT JOIN
                        proyek pry ON pry.id_proyek = klp.id_proyek
                    WHERE 
                        skp.id_siswa = ${parseInt(item.id_siswa as any)} and pry.is_active = true;
                `;

                item.kuis = await this._prismaService.$queryRaw`
                    SELECT 
                        kis.id_kuis,
                        kis.judul,
                        kis.kategori_kuis,
                        kis.create_at,
                        nlk.nilai::integer
                    FROM 
                        kuis kis 
                    LEFT JOIN 
                        nilai_kuis nlk ON nlk.id_kuis = kis.id_kuis
                    WHERE 
                        nlk.id_siswa = ${parseInt(item.id_siswa as any)} and kis.is_active = true;
                `;
            }

            return {
                status: true,
                message: '',
                data: siswaArr
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getPerSiswa(id_siswa: number): Promise<NilaiModel.GetNilaiForSiswa> {
        try {
            const siswa = await this._prismaService
                .siswa
                .findUnique({
                    where: {
                        id_siswa: parseInt(id_siswa as any)
                    },
                    include: {
                        kelas: {
                            select: {
                                kelas: true
                            }
                        }
                    }
                });

            const proyek = await this._prismaService.$queryRaw`
                SELECT 
                    pry.id_proyek,
                    pry.judul,
                    klp.kelompok_proyek,
                    klp.nilai_pertemuan_1,
                    klp.nilai_pertemuan_2,
                    klp.nilai_pertemuan_3,
                    klp.nilai_pertemuan_4,
                    klp.appresiasi,
                    pry.create_at
                FROM 
                    siswa_kelompok_proyek skp
                LEFT JOIN 
                    kelompok_proyek klp ON klp.id_kelompok_proyek = skp.id_kelompok_proyek
                LEFT JOIN
                    proyek pry ON pry.id_proyek = klp.id_proyek
                WHERE 
                    skp.id_siswa = ${parseInt(id_siswa as any)} and pry.is_active = true;
            `;

            const kuis = await this._prismaService.$queryRaw`
                SELECT 
                    kis.id_kuis,
                    kis.judul,
                    kis.kategori_kuis,
                    kis.create_at,
                    nlk.nilai::integer
                FROM 
                    kuis kis 
                LEFT JOIN 
                    nilai_kuis nlk ON nlk.id_kuis = kis.id_kuis
                WHERE 
                    nlk.id_siswa = ${parseInt(id_siswa as any)} and kis.is_active = true;
            `;

            let siswaArr: any = {
                id_siswa: siswa.id_siswa,
                no_absen: siswa.no_absen,
                nama_lengkap: siswa.nama_lengkap,
                id_kelas: siswa.id_kelas,
                kelas: siswa.kelas.kelas,
                proyek: proyek,
                kuis: kuis
            }

            return {
                status: true,
                message: '',
                data: siswaArr
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
