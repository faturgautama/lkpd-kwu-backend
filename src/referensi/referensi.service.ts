import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReferensiModel } from './referensi.model';
import { Request } from 'express';

@Injectable()
export class ReferensiService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(query: ReferensiModel.IReferensiQueryParams): Promise<ReferensiModel.GetAllReferensi> {
        try {
            let res: any[] = await this._prismaService
                .referensi
                .findMany({
                    where: Object.keys(query).reduce((aggregate, property) => {
                        if (property == 'id_kelas') {
                            aggregate[property] = parseInt(query[property] as any);
                        }
                        return aggregate;
                    }, {}),
                    orderBy: {
                        create_at: 'asc'
                    }
                });

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

    async getById(id_referensi: number): Promise<ReferensiModel.GetByIdReferensi> {
        try {
            let res: any = await this._prismaService
                .referensi
                .findUnique({
                    where: { id_referensi: parseInt(id_referensi as any) }
                });

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

    async create(req: Request, payload: ReferensiModel.CreateReferensi): Promise<any> {
        try {
            let res = await this._prismaService
                .referensi
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

    async update(payload: ReferensiModel.UpdateReferensi): Promise<any> {
        try {
            const { id_referensi, ...data } = payload

            let res = await this._prismaService
                .referensi
                .update({
                    where: { id_referensi: parseInt(id_referensi as any) },
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

    async delete(id_referensi: number): Promise<any> {
        try {
            let res = await this._prismaService
                .referensi
                .delete({
                    where: { id_referensi: parseInt(id_referensi as any) },
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
