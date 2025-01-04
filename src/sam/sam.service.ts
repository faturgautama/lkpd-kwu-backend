import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SamModel } from './sam.model';
import { Request, Response } from 'express';

@Injectable()
export class SamService {

    constructor(
        private prisma: PrismaService
    ) { }

    async getAll(jenis?: string, ukuran?: string): Promise<any> {
        try {
            let res: any = [];

            if (jenis && !ukuran) {
                res = await this.prisma.samUnit.findMany({
                    where: {
                        jenis: jenis
                    }
                })
            };

            if (!jenis && ukuran) {
                res = await this.prisma.samUnit.findMany({
                    where: {
                        ukuran: ukuran
                    }
                })
            };

            if (jenis && ukuran) {
                res = await this.prisma.samUnit.findMany({
                    where: {
                        jenis: jenis,
                        ukuran: ukuran,
                    }
                })
            };

            if (!jenis && !ukuran) {
                res = await this.prisma.samUnit.findMany();
            };

            for (let item of res) {
                item.path_foto = [];

                const resultFoto = await this.prisma.samImage.findFirst({
                    where: {
                        id_unit: item.id
                    },
                    select: {
                        path_foto: true
                    }
                });

                item.path_foto = [
                    resultFoto ? resultFoto.path_foto : null
                ];
            }


            if (!res) {
                return [];
            };

            return res;

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

    async getAllForBeranda(ukuran: string): Promise<any> {
        try {
            let res: any = await this.prisma.samUnit.findMany({
                where: {
                    ukuran: ukuran
                },
                take: 4,
                orderBy: {
                    id: 'desc'
                }
            });

            for (let item of res) {
                item.path_foto = [];

                const resultFoto = await this.prisma.samImage.findFirst({
                    where: {
                        id_unit: item.id
                    },
                    select: {
                        path_foto: true
                    }
                });

                item.path_foto = [
                    resultFoto ? resultFoto.path_foto : null
                ];
            }

            if (!res) {
                return [];
            };

            return res;

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

    async getById(id: number): Promise<any> {
        try {
            let res: any = await this.prisma.samUnit.findUnique({
                where: {
                    id: parseInt(id as any),
                }
            })

            if (!res) {
                return null;
            };

            res.path_foto = [];

            const resultFoto = await this.prisma.samImage.findMany({
                where: {
                    id_unit: parseInt(id as any),
                },
                select: {
                    path_foto: true
                }
            });

            res.path_foto = resultFoto.map((item) => { return item.path_foto })

            return res;

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

    async create(payload: SamModel.CreateSamUnit, req: Request): Promise<any> {
        try {
            const { path_foto, ...data } = payload;

            const res: any = await this.prisma.samUnit.create({ data: data });

            if (!res) {
                return {
                    status: false,
                    message: "Data Produk Gagal Disimpan",
                    data: null
                }
            };

            const resImage = await this.prisma.samImage.createMany({
                data: path_foto.map((item) => {
                    return {
                        id_unit: res.id,
                        path_foto: item
                    }
                })
            });

            if (!resImage) {
                return {
                    status: false,
                    message: "Data Produk Gagal Disimpan",
                    data: null
                }
            };

            return res;

        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(payload: SamModel.UpdateSamUnit, req: Request): Promise<any> {
        try {
            const { path_foto, ...data } = payload;

            const res: any = await this.prisma.samUnit.update({
                where: {
                    id: parseInt(data.id as any),
                },
                data: data,
            });

            if (!res) {
                return {
                    status: false,
                    message: "Data Produk Gagal Diperbarui",
                    data: null
                }
            };

            const resDeleteImage = await this.prisma.samImage.deleteMany({
                where: {
                    id_unit: res.id
                }
            });

            if (!resDeleteImage) {
                return {
                    status: false,
                    message: "Data Produk Gagal Diperbarui",
                    data: null
                }
            };

            const resInsertImage = await this.prisma.samImage.createMany({
                data: path_foto.map((item) => {
                    return {
                        id_unit: res.id,
                        path_foto: item
                    }
                })
            });

            if (!resInsertImage) {
                return {
                    status: false,
                    message: "Data Produk Gagal Diperbarui",
                    data: null
                }
            };

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

    async delete(id: string, req: Request): Promise<any> {
        try {
            const resDeleteImage = await this.prisma.samImage.deleteMany({
                where: {
                    id_unit: parseInt(id as any)
                }
            });

            if (!resDeleteImage) {
                return {
                    status: false,
                    message: "Data Produk Gagal Dihapus",
                    data: null
                }
            };

            const res: any = await this.prisma.samUnit.delete({
                where: {
                    id: parseInt(id as any),
                },
            });

            if (!res) {
                return {
                    status: false,
                    message: "Data Produk Gagal Dihapus",
                    data: null
                }
            };
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
