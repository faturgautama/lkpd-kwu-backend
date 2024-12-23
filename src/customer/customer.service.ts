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

    async getReport(id_customer: number, date: string): Promise<CustomerModel.GetReportCustomer> {
        try {
            let res: CustomerModel.IReportCustomer = {
                total_fill: 0,
                total_fill_today: 0,
                total_consume: 0,
                total_consume_today: 0,
                weekly_consume: [],
                today_consume: []
            };

            // ** Search total fill
            const totalFillQuery: any[] = await this.prisma
                .$queryRaw`
                    SELECT
                        SUM(tfl.litre) as total_fill
                    FROM "TumblerFillLog" tfl
                    LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                    WHERE 
                        tbl.id_customer = ${parseInt(id_customer as any)}
                `;

            res.total_fill = totalFillQuery.length ? this.formatingTwoLeadingZero(totalFillQuery[0].total_fill) : 0

            // ** Search total fill today
            const totalFillTodayQuery: any[] = await this.prisma
                .$queryRaw`
                    SELECT
                        SUM(tfl.litre) as total_fill_today
                    FROM "TumblerFillLog" tfl
                    LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                    WHERE 
                        tbl.id_customer = ${parseInt(id_customer as any)} and
                        tbl.date_time::date = ${date}::date
                `;

            res.total_fill_today = totalFillTodayQuery.length ? this.formatingTwoLeadingZero(totalFillTodayQuery[0].total_fill_today) : 0

            // ** Search total consume
            const totalConsumeQuery: any[] = await this.prisma
                .$queryRaw`
                  SELECT
                      SUM(tfl.litre) as total_consume
                  FROM "TumblerConsumeLog" tfl
                  LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                  WHERE 
                      tbl.id_customer = ${parseInt(id_customer as any)}
              `;

            res.total_consume = totalConsumeQuery.length ? this.formatingTwoLeadingZero(totalConsumeQuery[0].total_consume) : 0

            // ** Search total fill today
            const totalConsumeTodayQuery: any[] = await this.prisma
                .$queryRaw`
                 SELECT
                     SUM(tfl.litre) as total_consume_today
                 FROM "TumblerConsumeLog" tfl
                 LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                 WHERE 
                     tbl.id_customer = ${parseInt(id_customer as any)} and
                     tbl.date_time::date = ${date}::date
             `;

            res.total_consume_today = totalConsumeTodayQuery.length ? this.formatingTwoLeadingZero(totalConsumeTodayQuery[0].total_consume_today) : 0

            const currentDate = new Date(date);
            const firstDateSearch = new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString().split('T')[0];

            // ** Search weekly consume
            const weeklyConsumeQuery: any[] = await this.prisma
                .$queryRaw`
                    SELECT
                        tfl.created_at::date as date_time,
                        SUM(tfl.litre) as litre
                    FROM "TumblerConsumeLog" tfl
                    LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                    WHERE 
                        tbl.id_customer = ${parseInt(id_customer as any)} AND
                        tbl.date_time::date >= ${firstDateSearch}::date AND
                        tbl.date_time::date <= ${date}::date
                    GROUP BY
                        tfl.created_at::date
                `;

            res.weekly_consume = weeklyConsumeQuery.length ? weeklyConsumeQuery : [];

            // ** Search today consume
            const todayConsumeQuery: any[] = await this.prisma
                .$queryRaw`
                    SELECT
                        tfl.created_at as date_time,
                        SUM(tfl.litre) as litre
                    FROM "TumblerConsumeLog" tfl
                    LEFT JOIN "TumblerLog" tbl ON tbl.id_tumbler_log = tfl.id_tumbler_log
                    WHERE 
                        tbl.id_customer = ${parseInt(id_customer as any)} AND
                        tbl.date_time::date = ${date}::date
                    GROUP BY
                        tfl.created_at
                    ORDER BY
                        tfl.created_at
                `;

            res.today_consume = todayConsumeQuery.length ? todayConsumeQuery : [];

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

    private formatingTwoLeadingZero(value: string) {
        return parseFloat(Number(value).toFixed(2))
    }
}
