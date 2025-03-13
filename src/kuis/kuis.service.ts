import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { KuisModel } from './kuis.model';
import { Request } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class KuisService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(query: KuisModel.IKuisQueryParams): Promise<KuisModel.GetAllKuis> {
        try {
            let filter: any = {
                is_active: true
            };

            if (query.id_kelas) {
                filter.id_kelas = parseInt(query.id_kelas as any)
            };

            if (query.kategori) {
                filter.kategori_kuis = query.kategori;
            };

            let res = await this._prismaService
                .kuis
                .findMany({
                    where: filter,
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                            }
                        }
                    },
                    orderBy: {
                        create_at: 'asc'
                    }
                });

            let mappedRes: any[] = res.map((item) => {
                return {
                    id_kuis: item.id_kuis,
                    id_kelas: item.id_kelas,
                    kelas: item.kelas.kelas,
                    judul: item.judul,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    kategori_kuis: item.kategori_kuis,
                    deskripsi: item.deskripsi,
                    create_at: item.create_at,
                    create_by: item.create_by,
                    update_at: item.update_at,
                    update_by: item.update_by,
                    is_active: item.is_active,
                    is_answered: false,
                    skor: 0,
                }
            })

            if (query.id_siswa) {
                for (const item of mappedRes) {
                    item.is_answered = false;
                    item.skor = 0;

                    const pertanyaans = await this._prismaService
                        .pertanyaan_kuis
                        .findMany({
                            where: {
                                id_kuis: parseInt(item.id_kuis)
                            }
                        });

                    for (const question of pertanyaans) {
                        const jawaban_kuis = await this._prismaService
                            .jawaban_kuis
                            .findFirst({
                                where: {
                                    id_pertanyaan: question.id_pertanyaan,
                                    id_siswa: parseInt(query.id_siswa as any)
                                }
                            });

                        item.is_answered = jawaban_kuis ? true : false;
                    }

                    const dataNilaiKuis = await this._prismaService
                        .nilai_kuis
                        .findFirst({
                            where: {
                                id_siswa: parseInt(query.id_siswa as any),
                                id_kuis: parseInt(item.id_kuis as any)
                            }
                        });

                    item.skor = dataNilaiKuis ? parseFloat(dataNilaiKuis.nilai as any) : 0;
                }
            };

            return {
                status: true,
                message: '',
                data: mappedRes
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

    async getById(id_kuis: number): Promise<KuisModel.GetByIdKuis> {
        try {
            let res: any = await this._prismaService
                .kuis
                .findUnique({
                    where: { id_kuis: parseInt(id_kuis as any) },
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                                sekolah: true
                            }
                        },
                        pertanyaan_kuis: true
                    },
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found!',
                    data: null
                }
            }

            return {
                status: true,
                message: '',
                data: {
                    id_kuis: res.id_kuis,
                    id_kelas: res.id_kelas,
                    kelas: res.kelas.kelas,
                    judul: res.judul,
                    start_date: res.start_date,
                    end_date: res.end_date,
                    kategori_kuis: res.kategori_kuis,
                    deskripsi: res.deskripsi,
                    create_at: res.create_at,
                    create_by: res.create_by,
                    update_at: res.update_at,
                    update_by: res.update_by,
                    is_active: res.is_active,
                    pertanyaan: res.pertanyaan_kuis,
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

    async getKuisWithJawaban(id_kuis: number, id_siswa: number): Promise<any> {
        try {
            let res: any = await this._prismaService
                .kuis
                .findUnique({
                    where: { id_kuis: parseInt(id_kuis as any) },
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                                sekolah: true
                            }
                        },
                        pertanyaan_kuis: true
                    },
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found!',
                    data: null
                }
            }

            let pertanyaan_with_answer = [];

            for (const pertanyaan of res.pertanyaan_kuis) {
                const jawaban_kuis = await this._prismaService
                    .jawaban_kuis
                    .findFirst({
                        where: {
                            id_pertanyaan: parseInt(pertanyaan.id_pertanyaan),
                            id_siswa: parseInt(id_siswa as any)
                        },
                        select: {
                            id_jawaban: true,
                            jawaban: true,
                            is_correct: true,
                        }
                    });

                pertanyaan_with_answer.push({
                    ...pertanyaan,
                    id_jawaban: jawaban_kuis ? jawaban_kuis.id_jawaban : null,
                    jawaban: jawaban_kuis ? jawaban_kuis.jawaban : '',
                    is_correct: jawaban_kuis ? jawaban_kuis.is_correct : false
                })
            };

            const nilaiKuis = await this.getNilaiKuis(id_kuis, id_siswa);

            return {
                status: true,
                message: '',
                data: {
                    id_kuis: res.id_kuis,
                    id_kelas: res.id_kelas,
                    kelas: res.kelas.kelas,
                    judul: res.judul,
                    start_date: res.start_date,
                    end_date: res.end_date,
                    kategori_kuis: res.kategori_kuis,
                    deskripsi: res.deskripsi,
                    skor: nilaiKuis.status ? nilaiKuis.data : 0,
                    create_at: res.create_at,
                    create_by: res.create_by,
                    update_at: res.update_at,
                    update_by: res.update_by,
                    is_active: res.is_active,
                    pertanyaan: pertanyaan_with_answer.sort((a, b) => a.id_pertanyaan - b.id_pertanyaan),
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

    async create(req: Request, payload: KuisModel.CreateKuis): Promise<any> {
        try {
            return this._prismaService.$transaction(async (tx) => {
                const { pertanyaan, ...insertKuis } = payload;

                let res = await tx
                    .kuis
                    .create({
                        data: {
                            ...insertKuis,
                            type: payload.kategori_kuis == 'PRE TEST' ? 'pilihan_ganda' : 'essai',
                            create_at: new Date(),
                            create_by: req['user']['id_user'],
                        }
                    });

                if (!res) {
                    return {
                        status: false,
                        message: 'Create kuis failed',
                        data: null
                    }
                };

                for (const kel of pertanyaan) {
                    let resCreatePertanyaan = await tx
                        .pertanyaan_kuis
                        .create({
                            data: {
                                id_kuis: parseInt(res.id_kuis as any),
                                pertanyaan: kel.pertanyaan,
                                option_a: res.type == 'essai' ? '-' : kel.option_a,
                                option_b: res.type == 'essai' ? '-' : kel.option_b,
                                option_c: res.type == 'essai' ? '-' : kel.option_c,
                                option_d: res.type == 'essai' ? '-' : kel.option_d,
                                correct: res.type == 'essai' ? '-' : kel.correct,
                                create_at: new Date(),
                                create_by: req['user']['id_user'],
                            }
                        });

                    if (!resCreatePertanyaan) {
                        return {
                            status: false,
                            message: 'Create pertanyaan kuis failed',
                            data: null
                        }
                    };
                }

                return {
                    status: true,
                    message: '',
                    data: res
                }
            })
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

    async update(payload: KuisModel.UpdateKuis): Promise<any> {
        try {
            const { id_kuis, ...data } = payload;

            let res = await this._prismaService
                .kuis
                .update({
                    where: {
                        id_kuis: parseInt(id_kuis as any)
                    },
                    data: data
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update kuis failed',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: res
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

    async insertPertanyaan(req: Request, payload: KuisModel.CreateNewPertanyaanKuis): Promise<any> {
        try {
            let res = await this._prismaService
                .pertanyaan_kuis
                .create({
                    data: {
                        ...payload,
                        create_at: new Date(),
                        create_by: req['user']['id_user'],
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Create pertanyaan kuis failed',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: res
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

    async updatePertanyaan(req: Request, payload: KuisModel.UpdatePertanyaanKuis): Promise<any> {
        try {
            const { id_pertanyaan, ...data } = payload;

            let res = await this._prismaService
                .pertanyaan_kuis
                .update({
                    where: {
                        id_pertanyaan: parseInt(id_pertanyaan as any)
                    },
                    data: data
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update pertanyaan kuis failed',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: res
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

    async deletePertanyaan(id_pertanyaan: any): Promise<any> {
        try {
            let res = await this._prismaService
                .pertanyaan_kuis
                .delete({
                    where: {
                        id_pertanyaan: parseInt(id_pertanyaan as any)
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Delete pertanyaan kuis failed',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: res
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

    async insertMultiJawaban(req: Request, payload: KuisModel.CreateJawabanKuis): Promise<any> {
        try {
            let res = await this._prismaService
                .jawaban_kuis
                .createMany({
                    data: payload.detail_jawaban.map((item: any) => {
                        return {
                            id_pertanyaan: item.id_pertanyaan,
                            id_siswa: item.id_siswa,
                            jawaban: item.jawaban,
                            is_correct: item.jawaban == item.correct,
                            submit_at: new Date()
                        }
                    })
                });

            if (res.count < 1) {
                return {
                    status: false,
                    message: 'Create jawaban kuis failed',
                    data: null
                }
            };

            return {
                status: true,
                message: 'Insert Jawaban Berhasil',
                data: null
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

    async penilaianJawaban(req: Request, payload: KuisModel.NilaiJawabanKuis): Promise<any> {
        try {
            let res = await this._prismaService
                .jawaban_kuis
                .update({
                    where: {
                        id_jawaban: parseInt(payload.id_jawaban as any)
                    },
                    data: {
                        is_correct: payload.is_correct
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Nilai jawaban kuis failed',
                    data: null
                }
            };

            const dataJawabanKuis: any[] = await this._prismaService.$queryRaw`
                SELECT COUNT(*)::integer AS skor
                FROM jawaban_kuis jk
                LEFT JOIN pertanyaan_kuis pk ON pk.id_pertanyaan = jk.id_pertanyaan
                LEFT JOIN kuis ks ON ks.id_kuis = pk.id_kuis
                WHERE 
                    jk.id_siswa = ${parseInt(payload.id_siswa as any)}
                    AND ks.id_kuis = ${parseInt(payload.id_kuis as any)} 
                    AND jk.is_correct = true;
            `;

            let skor = 0;

            if (dataJawabanKuis.length) {
                skor = 50 * dataJawabanKuis[0].skor;
            }

            const dataNilaiKuis = await this._prismaService
                .nilai_kuis
                .findFirst({
                    where: {
                        id_siswa: parseInt(payload.id_siswa as any),
                        id_kuis: parseInt(payload.id_kuis as any)
                    }
                });

            if (dataNilaiKuis) {
                let updateNilai = await this._prismaService
                    .nilai_kuis
                    .update({
                        where: {
                            id_nilai_kuis: parseInt(dataNilaiKuis.id_nilai_kuis as any),
                        },
                        data: {
                            nilai: skor
                        }
                    });

                if (!updateNilai) {
                    return {
                        status: false,
                        message: 'Update nilai kuis failed',
                        data: null
                    }
                }
            };

            if (!dataNilaiKuis) {
                let insertNilai = await this._prismaService
                    .nilai_kuis
                    .create({
                        data: {
                            id_siswa: parseInt(payload.id_siswa as any),
                            id_kuis: parseInt(payload.id_kuis as any),
                            nilai: skor,
                            create_at: new Date(),
                            create_by: req['user']['id_user']
                        }
                    });

                if (!insertNilai) {
                    return {
                        status: false,
                        message: 'Insert nilai kuis failed',
                        data: null
                    }
                }
            };

            return {
                status: true,
                message: 'OK',
                data: skor
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

    async getNilaiKuis(id_kuis: number, id_siswa: number): Promise<any> {
        try {
            const dataJawabanKuis: any[] = await this._prismaService.$queryRaw`
                SELECT COUNT(*)::integer AS skor
                FROM jawaban_kuis jk
                LEFT JOIN pertanyaan_kuis pk ON pk.id_pertanyaan = jk.id_pertanyaan
                LEFT JOIN kuis ks ON ks.id_kuis = pk.id_kuis
                WHERE 
                    jk.id_siswa = ${parseInt(id_siswa as any)}
                    AND ks.id_kuis = ${parseInt(id_kuis as any)} 
                    AND jk.is_correct = true;
            `;

            let skor = 0;

            if (dataJawabanKuis.length) {
                skor = 10 * dataJawabanKuis[0].skor;
            }

            const dataNilaiKuis = await this._prismaService
                .nilai_kuis
                .findFirst({
                    where: {
                        id_siswa: parseInt(id_siswa as any),
                        id_kuis: parseInt(id_kuis as any)
                    }
                });

            if (dataNilaiKuis) {
                let updateNilai = await this._prismaService
                    .nilai_kuis
                    .update({
                        where: {
                            id_nilai_kuis: parseInt(dataNilaiKuis.id_nilai_kuis as any),
                        },
                        data: {
                            nilai: skor
                        }
                    });

                if (!updateNilai) {
                    return {
                        status: false,
                        message: 'Update nilai kuis failed',
                        data: null
                    }
                }
            };

            if (!dataNilaiKuis) {
                let insertNilai = await this._prismaService
                    .nilai_kuis
                    .create({
                        data: {
                            id_siswa: parseInt(id_siswa as any),
                            id_kuis: parseInt(id_kuis as any),
                            nilai: skor,
                            create_at: new Date(),
                            create_by: parseInt(id_siswa as any),
                        }
                    });

                if (!insertNilai) {
                    return {
                        status: false,
                        message: 'Insert nilai kuis failed',
                        data: null
                    }
                }
            };

            return {
                status: true,
                message: 'OK',
                data: skor
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

    async nilaiTugas(req: Request, payload: KuisModel.UpdateNilaiTugas): Promise<any> {
        try {
            let nilaiKuis = await this._prismaService
                .nilai_kuis
                .findFirst({
                    where: {
                        id_kuis: parseInt(payload.id_kuis as any),
                        id_siswa: parseInt(payload.id_siswa as any)
                    }
                });

            if (nilaiKuis.id_nilai_kuis) {
                let updateNilai = await this._prismaService
                    .nilai_kuis
                    .update({
                        where: {
                            id_nilai_kuis: parseInt(nilaiKuis.id_nilai_kuis as any),
                        },
                        data: {
                            nilai: parseInt(payload.nilai as any)
                        }
                    });

                if (!updateNilai) {
                    return {
                        status: false,
                        message: 'Update nilai siswa gagal',
                        data: null
                    }
                };
            }

            let createNilai = await this._prismaService
                .nilai_kuis
                .create({
                    data: {
                        id_kuis: parseInt(payload.id_kuis as any),
                        id_siswa: parseInt(payload.id_siswa as any),
                        nilai: parseInt(payload.nilai as any),
                        create_at: new Date(),
                        create_by: req['user']['id_user']
                    }
                });

            if (!createNilai) {
                return {
                    status: false,
                    message: 'Update nilai siswa gagal',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
                data: nilaiKuis
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
