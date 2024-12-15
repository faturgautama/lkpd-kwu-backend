import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerModel } from './customer.model';
import { Request } from 'express';

@Injectable()
export class CustomerService {

    constructor(
        private prisma: PrismaService
    ) { }

    async getAll(): Promise<CustomerModel.GetAllCustomer> {
        try {
            const res: any[] = await this.prisma.customer.findMany();

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
                    created_by: parseInt(req.user['id_employee'] as any),
                }
            });

            if (!res) {
                return {
                    status: false,
                    message: 'Gagal menambahkan data',
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
