import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NilaiModel } from './nilai.model';
import { PrismaService } from 'src/prisma.service';
import { SpreadsheetService } from 'src/utility/spreadsheet.service';

@Injectable()
export class NilaiService {

    constructor(
        private _prismaService: PrismaService,
        private _spreadsheetService: SpreadsheetService,
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

    async syncToSheet(): Promise<NilaiModel.GetNilaiByKelas> {
        try {
            const siswa = await this._prismaService.siswa.findMany({
                include: {
                    kelas: { select: { kelas: true } }
                },
                orderBy: { id_siswa: 'asc' }
            });

            // Group students by kelas
            const groupedByKelas = siswa.reduce((acc, item) => {
                const kelas = item.kelas.kelas;
                if (!acc[kelas]) acc[kelas] = [];
                acc[kelas].push({
                    no_absen: item.no_absen,
                    nama_lengkap: item.nama_lengkap,
                    nilai_pertemuan_1: 0,
                    nilai_pertemuan_2: 0,
                    nilai_pertemuan_3: 0,
                    nilai_pertemuan_4: 0,
                });
                return acc;
            }, {} as Record<string, any[]>);

            const spreadsheetId = '1_DG958iPYov2vdukHm0Ha3yllKrwDoT5ld2FTUHlqTk';

            for (const kelas in groupedByKelas) {
                // Create a sheet for this kelas
                await this._spreadsheetService.createOrUpdateSheet(spreadsheetId, kelas);

                // Prepare data for this kelas
                const header = ['No. Absen', 'Nama Siswa', '1', '2', '3', '4'];
                const dataSource = groupedByKelas[kelas].map(item => [
                    item.no_absen,
                    item.nama_lengkap,
                    item.nilai_pertemuan_1,
                    item.nilai_pertemuan_2,
                    item.nilai_pertemuan_3,
                    item.nilai_pertemuan_4
                ]);

                const values = [header, ...dataSource];

                // Append data to the new sheet
                await this._spreadsheetService.appendSheetData(spreadsheetId, `${kelas}!A1`, values);
            }

            return {
                status: true,
                message: 'Sheets created and data synced successfully!',
                data: null
            };

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
