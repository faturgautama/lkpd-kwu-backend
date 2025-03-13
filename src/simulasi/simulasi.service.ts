import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { SimulasiModel } from './simulasi.model';
import { PrismaService } from 'src/prisma.service';

@Injectable({ scope: Scope.TRANSIENT })
export class SimulasiService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getKuisWithJawaban(query: SimulasiModel.ISimulasiQueryParams): Promise<any> {
        try {
            let res = await this._prismaService
                .simulasi
                .findFirst({
                    where: { id_kelas: parseInt(query.id_kelas as any) },
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                                sekolah: true
                            }
                        }
                    },
                });

            let jawabanSiswa = await this._prismaService
                .jawaban_simulasi
                .findFirst({
                    where: {
                        id_siswa: parseInt(query.id_siswa as any),
                        id_simulasi: parseInt(res.id_simulasi as any),
                    },
                    include: {
                        siswa: {
                            select: {
                                id_kelas: true,
                                nama_lengkap: true,
                                no_absen: true
                            }
                        },
                    },
                });


            if (!res) {
                return {
                    status: false,
                    message: 'Data not found!',
                    data: null
                }
            };

            const { kelas, ...data } = res;

            return {
                status: true,
                message: '',
                data: {
                    ...data,
                    kelas: kelas.kelas,
                    jawaban_simulasi: jawabanSiswa
                }
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

    async updateJawaban(payload: SimulasiModel.UpdateJawabanSimulasi): Promise<any> {
        try {
            const jawabanSiswa = await this._prismaService
                .jawaban_simulasi
                .findFirst({
                    where: {
                        id_simulasi: parseInt(payload.id_simulasi as any),
                        id_siswa: parseInt(payload.id_siswa as any)
                    }
                });

            if (!jawabanSiswa) {
                let insertJawaban = await this._prismaService
                    .jawaban_simulasi
                    .create({
                        data: {
                            ...payload,
                            create_at: new Date(),
                            create_by: parseInt(payload.id_siswa as any),
                        }
                    });

                if (!insertJawaban) {
                    return {
                        status: false,
                        message: 'Insert jawaban gagal',
                        data: null
                    }
                };
            };

            let updateJawaban = await this._prismaService
                .jawaban_simulasi
                .update({
                    where: {
                        id_jawaban_simulasi: parseInt(jawabanSiswa.id_jawaban_simulasi as any)
                    },
                    data: {
                        ...payload,
                        create_at: new Date(),
                        create_by: parseInt(payload.id_siswa as any),
                    }
                });

            if (!updateJawaban) {
                return {
                    status: false,
                    message: 'Update jawaban gagal',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: jawabanSiswa
            }

        } catch (error) {
            console.log("error =>", error);
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
