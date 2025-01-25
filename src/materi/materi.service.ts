import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MateriModel } from './materi.model';
import { PrismaService } from 'src/prisma.service';
import { Request } from 'express';

@Injectable()
export class MateriService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(query: MateriModel.IMateriQueryParams): Promise<MateriModel.GetAllMateri> {
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

            let res = await this._prismaService
                .materi
                .findMany({
                    where: filter,
                    include: {
                        kelas: {
                            select: {
                                id_kelas: true,
                                kelas: true,
                                sekolah: true
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
                        id_materi: item.id_materi,
                        id_kelas: item.id_kelas,
                        kelas: item.kelas.kelas,
                        judul: item.judul,
                        file_name: item.file_name,
                        create_at: item.create_at,
                        create_by: item.create_by,
                        update_at: item.update_at,
                        update_by: item.update_by
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

    async getById(id_materi: number): Promise<MateriModel.GetByIdMateri> {
        try {
            let res = await this._prismaService
                .materi
                .findUnique({
                    where: { id_materi: parseInt(id_materi as any) },
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
                    id_materi: res.id_materi,
                    id_kelas: res.id_kelas,
                    kelas: res.kelas.kelas,
                    judul: res.judul,
                    file_name: res.file_name,
                    file_base_64: res.file_base_64,
                    create_at: res.create_at,
                    create_by: res.create_by,
                    update_at: res.update_at,
                    update_by: res.update_by
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

    async create(req: Request, payload: MateriModel.CreateMateri): Promise<any> {
        try {
            let res = await this._prismaService
                .materi
                .create({
                    data: {
                        ...payload,
                        create_at: new Date(),
                        create_by: req['user']['id_user']
                    }
                })

            return {
                status: true,
                message: '',
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

    async update(req: Request, payload: MateriModel.UpdateMateri): Promise<any> {
        try {
            const { id_materi, ...data } = payload

            let res = await this._prismaService
                .materi
                .update({
                    where: { id_materi: parseInt(id_materi as any) },
                    data: {
                        ...data,
                        update_at: new Date(),
                        update_by: req['user']['id_user']
                    }
                })

            return {
                status: true,
                message: '',
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

    async delete(id_materi: number): Promise<any> {
        try {
            let res = await this._prismaService
                .materi
                .delete({
                    where: { id_materi: parseInt(id_materi as any) }
                });

            if (!res) {
                return {
                    status: false,
                    message: 'Something went wrong!',
                    data: null
                }
            };

            return {
                status: true,
                message: 'OK',
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
}
