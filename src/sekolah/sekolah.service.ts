import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SekolahModel } from './sekolah.model';
import { filter } from 'rxjs';

@Injectable()
export class SekolahService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(): Promise<SekolahModel.GetAllSekolah> {
        try {
            let res: any[] = await this._prismaService
                .sekolah
                .findMany({
                    orderBy: {
                        nama_sekolah: 'asc'
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

    async getById(id_sekolah: number): Promise<SekolahModel.GetByIdSekolah> {
        try {
            let res = await this._prismaService
                .sekolah
                .findUnique({
                    where: {
                        id_sekolah: parseInt(id_sekolah as any)
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

    async create(payload: SekolahModel.CreateSekolah): Promise<any> {
        try {
            let res = await this._prismaService
                .sekolah
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

    async update(payload: SekolahModel.UpdateSekolah): Promise<any> {
        try {
            const { id_sekolah, ...data } = payload

            let res = await this._prismaService
                .sekolah
                .update({
                    where: { id_sekolah: parseInt(id_sekolah as any) },
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
