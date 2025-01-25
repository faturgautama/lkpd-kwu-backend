import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { KelasModel } from './kelas.model';

@Injectable()
export class KelasService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(): Promise<KelasModel.GetAllKelas> {
        try {
            let res = await this._prismaService
                .kelas
                .findMany({
                    include: {
                        sekolah: {
                            select: {
                                id_sekolah: true,
                                nama_sekolah: true
                            }
                        }
                    },
                    orderBy: {
                        sekolah: {
                            nama_sekolah: 'asc'
                        }
                    }
                });

            return {
                status: true,
                message: '',
                data: res.map((item) => {
                    return {
                        id_kelas: item.id_kelas,
                        kelas: item.kelas,
                        id_sekolah: item.sekolah.id_sekolah,
                        nama_sekolah: item.sekolah.nama_sekolah,
                        is_active: item.is_active,
                        create_at: item.create_at
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

    async getById(id_kelas: number): Promise<KelasModel.GetByIdKelas> {
        try {
            let res = await this._prismaService
                .kelas
                .findUnique({
                    where: { id_kelas: parseInt(id_kelas as any) },
                    include: {
                        sekolah: {
                            select: {
                                id_sekolah: true,
                                nama_sekolah: true
                            }
                        }
                    }
                });


            return {
                status: true,
                message: '',
                data: {
                    id_kelas: res.id_kelas,
                    kelas: res.kelas,
                    id_sekolah: res.sekolah.id_sekolah,
                    nama_sekolah: res.sekolah.nama_sekolah,
                    is_active: res.is_active,
                    create_at: res.create_at
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

    async create(payload: KelasModel.CreateKelas): Promise<any> {
        try {
            let res = await this._prismaService
                .kelas
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

    async update(payload: KelasModel.UpdateKelas): Promise<any> {
        try {
            const { id_kelas, ...data } = payload

            let res = await this._prismaService
                .kelas
                .update({
                    where: { id_kelas: parseInt(id_kelas as any) },
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
