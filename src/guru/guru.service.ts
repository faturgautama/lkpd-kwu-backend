import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GuruModel } from './guru.model';

@Injectable()
export class GuruService {
    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(): Promise<GuruModel.GetAllGuru> {
        try {
            let res = await this._prismaService
                .guru
                .findMany({
                    include: {
                        sekolah: {
                            select: {
                                id_sekolah: true,
                                nama_sekolah: true,
                            }
                        }
                    },
                    orderBy: {
                        nama_lengkap: 'asc'
                    }
                })

            return {
                status: true,
                message: '',
                data: res.map((item) => {
                    return {
                        id_guru: item.id_guru,
                        nama_lengkap: item.nama_lengkap,
                        nip: item.nip,
                        id_sekolah: item.sekolah.id_sekolah,
                        nama_sekolah: item.sekolah.nama_sekolah,
                        is_active: item.is_active,
                        create_at: item.create_at,
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

    async getById(id_guru: number): Promise<GuruModel.GetByIdGuru> {
        try {
            let res = await this._prismaService
                .guru
                .findUnique({
                    include: {
                        sekolah: {
                            select: {
                                id_sekolah: true,
                                nama_sekolah: true,
                            }
                        }
                    },
                    where: {
                        id_guru: parseInt(id_guru as any)
                    }
                })

            return {
                status: true,
                message: '',
                data: {
                    id_guru: res.id_guru,
                    nama_lengkap: res.nama_lengkap,
                    nip: res.nip,
                    id_sekolah: res.sekolah.id_sekolah,
                    nama_sekolah: res.sekolah.nama_sekolah,
                    is_active: res.is_active,
                    create_at: res.create_at,
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

    async create(payload: GuruModel.CreateGuru): Promise<any> {
        try {
            let res = await this._prismaService
                .guru
                .create({
                    data: {
                        ...payload,
                        create_at: new Date()
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

    async update(payload: GuruModel.UpdateGuru): Promise<any> {
        try {
            const { id_guru, ...data } = payload

            let res = await this._prismaService
                .guru
                .update({
                    where: { id_guru: parseInt(id_guru as any) },
                    data: data
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
}
