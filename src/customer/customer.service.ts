import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerModel } from './customer.model';
import { Request } from 'express';

@Injectable()
export class CustomerService {

    constructor(
        private prisma: PrismaService
    ) { }

    async getAll(query?: CustomerModel.ICustomerQueryParams): Promise<CustomerModel.GetAllCustomer> {
        try {
            console.log("query =>", query);

            let res: any[] = [];

            if (query && Object.keys(query).length) {
                let filter: any = {};

                for (const item in query) {
                    if (item === 'full_name') {
                        filter.full_name = {
                            contains: query.full_name
                        };
                    };

                    if (item === 'device_id') {
                        filter.device_id = {
                            contains: query.device_id
                        };
                    };

                    if (item === 'email') {
                        filter.email = {
                            contains: query.email
                        };
                    };

                    if (item === 'is_active') {
                        filter.is_active = query.is_active
                    };
                }

                console.log("filter =>", filter);

                res = await this.prisma
                    .customer
                    .findMany({
                        where: filter,
                        orderBy: {
                            full_name: 'asc'
                        }
                    })
            } else {
                res = await this.prisma
                    .customer
                    .findMany({
                        orderBy: {
                            full_name: 'asc'
                        }
                    })
            }

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                    data: []
                }
            };

            return {
                status: true,
                message: '',
                data: res
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

    async getById(id_customer: number): Promise<CustomerModel.GetAllCustomer> {
        try {
            const res: any = await this.prisma.customer.findUnique({
                where: {
                    id_customer: parseInt(id_customer as any),
                }
            })

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                    data: []
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

    async create(payload: CustomerModel.CreateCustomer, req: Request): Promise<any> {
        try {
            const res: any = await this.prisma.customer.create({
                data: {
                    ...payload,
                    created_at: new Date(),
                    created_by: parseInt(req.user['id_user'] as any),
                }
            });

            if (!res) {
                return {
                    status: false,
                    message: "Data Customer Gagal Disimpan",
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

    async update(payload: CustomerModel.UpdateCustomer, req: Request): Promise<any> {
        try {
            const { id_customer, ...data } = payload;

            const res: any = await this.prisma.customer.update({
                where: {
                    id_customer: id_customer
                },
                data: {
                    ...data,
                    updated_at: new Date(),
                    updated_by: req.user['id_user'] ? parseInt(req.user['id_user'] as any) : parseInt(req.user['id_customer'] as any),
                }
            });

            if (!res) {
                return {
                    status: false,
                    message: "Data Customer Gagal Diperbarui",
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
