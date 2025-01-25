import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProyekModel } from './proyek.model';
import { Request } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class ProyekService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(query: ProyekModel.IProyekQueryParams): Promise<ProyekModel.GetAllProyek> {
        try {
            let filter: any = {};

            if (query.id_kelas) {
                filter.id_kelas = parseInt(query.id_kelas as any)
            };

            if (query.judul) {
                filter.judul = {
                    contains: query.judul,
                    mode: 'insensitive'
                }
            };

            if (query.kelompok_proyek) {
                filter.kelompok_proyek = {
                    ...filter.kelompok_proyek,
                    some: {
                        kelompok_proyek: {
                            contains: query.kelompok_proyek,
                            mode: 'insensitive'
                        }
                    }
                }
            };

            if (query.id_siswa) {
                filter.kelompok_proyek = {
                    ...filter.kelompok_proyek,
                    some: {
                        siswa_kelompok_proyek: {
                            some: {
                                id_siswa: parseInt(query.id_siswa as any)
                            }
                        }
                    }
                }
            };

            let res = await this._prismaService
                .proyek
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

            return {
                status: true,
                message: '',
                data: res.map((item) => {
                    return {
                        id_proyek: item.id_proyek,
                        id_kelas: item.id_kelas,
                        kelas: item.kelas.kelas,
                        judul: item.judul,
                        deskripsi: item.deskripsi,
                        create_at: item.create_at,
                        create_by: item.create_by,
                        is_active: item.is_active,
                    }
                })
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

    async getById(id_proyek: number): Promise<ProyekModel.GetByIdProyek> {
        try {
            let res: any = await this._prismaService
                .proyek
                .findUnique({
                    where: { id_proyek: parseInt(id_proyek as any) },
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                                sekolah: true
                            }
                        },
                        kelompok_proyek: {
                            select: {
                                id_kelompok_proyek: true,
                                kelompok_proyek: true,
                                siswa_kelompok_proyek: true
                            },
                        }
                    },
                });

            let newData = [];

            for (let kelompok of res.kelompok_proyek) {
                let siswa_kelompok_arr = [];

                for (let siswa of kelompok.siswa_kelompok_proyek) {
                    let dataSiswa = await this._prismaService
                        .siswa
                        .findUnique({
                            where: {
                                id_siswa: siswa.id_siswa
                            }
                        });

                    siswa.no_absen = dataSiswa.no_absen;
                    siswa.nama_lengkap = dataSiswa.nama_lengkap;

                    siswa_kelompok_arr.push(siswa);
                }

                kelompok.siswa_kelompok_proyek = siswa_kelompok_arr;
                newData.push(kelompok);
            }

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
                data: newData as any
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

    async create(req: Request, payload: ProyekModel.CreateProyek): Promise<any> {
        try {
            return this._prismaService.$transaction(async (tx) => {
                const { kelompok, ...insertProyek } = payload;

                let res = await tx
                    .proyek
                    .create({
                        data: {
                            ...insertProyek,
                            create_at: new Date(),
                            create_by: req['user']['id_user'],
                        }
                    });

                if (!res) {
                    return {
                        status: false,
                        message: 'Create proyek failed',
                        data: null
                    }
                };

                for (const kel of kelompok) {
                    let resCreateKelompok = await tx
                        .kelompok_proyek
                        .create({
                            data: {
                                id_proyek: parseInt(res.id_proyek as any),
                                kelompok_proyek: kel.kelompok_proyek,
                                hasil: "Belum Ada Hasil",
                                nilai_pertemuan_1: 0,
                                nilai_pertemuan_2: 0,
                                nilai_pertemuan_3: 0,
                                nilai_pertemuan_4: 0,
                                create_at: new Date(),
                                create_by: req['user']['id_user'],
                            }
                        });

                    if (!resCreateKelompok) {
                        return {
                            status: false,
                            message: 'Create kelompok proyek failed',
                            data: null
                        }
                    };

                    const payloadCreateSiswaPerKelompok = kel.detail_siswa.map((item: any) => {
                        return {
                            id_kelompok_proyek: resCreateKelompok.id_kelompok_proyek,
                            id_user: item.id_user,
                            id_siswa: item.id_siswa,
                        }
                    });

                    let resCreateSiswaKelompok = await tx
                        .siswa_kelompok_proyek
                        .createMany({
                            data: payloadCreateSiswaPerKelompok
                        });

                    if (!resCreateSiswaKelompok) {
                        return {
                            status: false,
                            message: 'Create siswa per kelompok proyek failed',
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

    async update(payload: ProyekModel.UpdateProyek): Promise<any> {
        try {
            const { id_proyek, ...data } = payload;

            let res = await this._prismaService
                .proyek
                .update({
                    where: {
                        id_proyek: parseInt(id_proyek as any)
                    },
                    data: data
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update proyek failed',
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

    async updateNilaiKelompok(req: Request, payload: ProyekModel.UpdateNilaiProyekKelompok): Promise<any> {
        try {
            const { id_kelompok_proyek, ...data } = payload;

            let res = await this._prismaService
                .kelompok_proyek
                .update({
                    where: {
                        id_kelompok_proyek: parseInt(id_kelompok_proyek as any),
                    },
                    data: data
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update nilai kelompok proyek failed',
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

    async updateKelompok(req: Request, payload: ProyekModel.UpdateProyekKelompok): Promise<any> {
        try {
            const { id_kelompok_proyek, ...data } = payload;

            let res = await this._prismaService
                .kelompok_proyek
                .update({
                    where: {
                        id_kelompok_proyek: parseInt(id_kelompok_proyek as any),
                    },
                    data: {
                        ...data,
                        update_at: new Date(),
                        update_by: req['user']['id_user']
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update kelompok proyek failed',
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

    async deleteKelompok(id_kelompok_proyek: any): Promise<any> {
        try {
            let resSiswa = await this._prismaService
                .siswa_kelompok_proyek
                .deleteMany({
                    where: {
                        id_kelompok_proyek: parseInt(id_kelompok_proyek as any)
                    }
                });

            if (!resSiswa) {
                return {
                    status: false,
                    message: 'Delete siswa per kelompok proyek failed',
                    data: null
                }
            };

            let res = await this._prismaService
                .kelompok_proyek
                .delete({
                    where: {
                        id_kelompok_proyek: parseInt(id_kelompok_proyek as any)
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Delete kelompok proyek failed',
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

    async insertSiswaKelompok(payload: ProyekModel.CreateNewProyekSiswaKelompok): Promise<any> {
        try {
            let res = await this._prismaService
                .siswa_kelompok_proyek
                .create({ data: payload });

            if (!res) {
                return {
                    status: false,
                    message: 'Create siswa per kelompok proyek failed',
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

    async updateSiswaKelompok(payload: ProyekModel.UpdateProyekSiswaKelompok): Promise<any> {
        try {
            const { id_siswa_kelompok_proyek, ...data } = payload;

            let res = await this._prismaService
                .siswa_kelompok_proyek
                .update({
                    where: {
                        id_siswa_kelompok_proyek: parseInt(id_siswa_kelompok_proyek as any)
                    },
                    data: data
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Update siswa per kelompok proyek failed',
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

    async deleteSiswaKelompok(id_siswa_kelompok_proyek: any): Promise<any> {
        try {
            let res = await this._prismaService
                .siswa_kelompok_proyek
                .delete({
                    where: {
                        id_siswa_kelompok_proyek: parseInt(id_siswa_kelompok_proyek as any)
                    }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Delete siswa per kelompok proyek failed',
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
}
