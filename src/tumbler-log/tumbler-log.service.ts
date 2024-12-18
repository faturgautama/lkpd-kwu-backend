import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TumblerLogModel } from './tumbler-log.model';
import { Request } from 'express';
import { UtilityService } from 'src/utility/utility.service';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TumblerLogService {

    constructor(
        private prisma: PrismaService,
        private utilityService: UtilityService,
        private notificationService: NotificationService,
    ) { }

    async getAll(query?: TumblerLogModel.TumblerLogQueryParams): Promise<TumblerLogModel.GetAllTumblerLog> {
        try {
            let res: any[] = [];

            if (Object.keys(query).length) {
                let filters = [];

                for (let key in query) {
                    if (key == 'id_customer') {
                        filters.push({
                            key: 'cust.id_customer',
                            type: '=',
                            searchText1: query.id_customer,
                            searchText2: '',
                        });
                    };

                    if (key == 'date_time') {
                        const start = new Date(query.date_time).toISOString();
                        const startArr = start.split("T");

                        const end = new Date(query.date_time).toISOString();
                        const endArr = end.split("T");

                        filters.push({
                            key: 'tbl.date_time::date',
                            type: 'BETWEEN',
                            searchText1: `${startArr[0]} 00:00:00`,
                            searchText2: `${endArr[0]} 23:59:59`,
                        });
                    };
                }

                res = await this.prisma.$queryRaw`
                    SELECT 
                        tbl.id_tumbler_log,
                        tbl.date_time,
                        cust.id_customer,
                        cust.full_name,
                        cust.device_id,
                        cust.device_name,
                        cust.device_type,
                        cust.device_size,
                        cust.device_notes
                    FROM "TumblerLog" tbl 
                    LEFT JOIN "Customer" cust ON cust.id_customer = tbl.id_customer
                    ${Prisma.raw(this.utilityService.convertFiltersToQuery(filters))}
                `;
            } else {
                res = await this.prisma.$queryRaw`
                    SELECT 
                        tbl.id_tumbler_log,
                        tbl.date_time,
                        cust.id_customer,
                        cust.full_name,
                        cust.device_id,
                        cust.device_name,
                        cust.device_type,
                        cust.device_size,
                        cust.device_notes
                    FROM "TumblerLog" tbl 
                    LEFT JOIN "Customer" cust ON cust.id_customer = tbl.id_customer
                `;
            }

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                    data: []
                }
            };

            let data: any[] = [];

            for (const item of res) {
                const tumblerFill = await this.prisma.tumblerFillLog.findMany({
                    where: {
                        id_tumbler_log: item.id_tumbler_log
                    },
                    orderBy: {
                        created_at: 'asc'
                    }
                });

                const tumblerConsume = await this.prisma.tumblerConsumeLog.findMany({
                    where: {
                        id_tumbler_log: item.id_tumbler_log
                    },
                    orderBy: {
                        created_at: 'asc'
                    }
                });

                data.push({
                    ...item,
                    initial_fill_litre: tumblerFill[0].litre || 0,
                    total_fill_litre: tumblerFill.reduce((acc, curr) => acc + curr.litre, 0) || 0,
                    total_consume_litre: tumblerConsume.reduce((acc, curr) => acc + curr.litre, 0) || 0
                });
            }

            return {
                status: true,
                message: '',
                data: data
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

    async getById(id_tumbler_log: string): Promise<TumblerLogModel.GetByIdTumblerLog> {
        try {
            let res: any = await this.prisma.$queryRaw`
                SELECT 
                    tbl.id_tumbler_log,
                    tbl.date_time,
                    cust.id_customer,
                    cust.full_name,
                    cust.device_id,
                    cust.device_name,
                    cust.device_type,
                    cust.device_size,
                    cust.device_notes
                FROM "TumblerLog" tbl 
                LEFT JOIN "Customer" cust ON cust.id_customer = tbl.id_customer
                WHERE tbl.id_tumbler_log = ${parseInt(id_tumbler_log)}
            `;

            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                    data: null
                }
            };

            let data: any = null;

            const tumblerFill = await this.prisma.tumblerFillLog.findMany({
                where: {
                    id_tumbler_log: parseInt(id_tumbler_log as string)
                },
                orderBy: {
                    created_at: 'asc'
                }
            });

            const tumblerConsume = await this.prisma.tumblerConsumeLog.findMany({
                where: {
                    id_tumbler_log: parseInt(id_tumbler_log as string)
                },
                orderBy: {
                    created_at: 'asc'
                }
            });

            data = {
                ...res[0],
                initial_fill_litre: tumblerFill[0].litre || 0,
                total_fill_litre: tumblerFill.reduce((acc, curr) => acc + curr.litre, 0) || 0,
                total_consume_litre: tumblerConsume.reduce((acc, curr) => acc + curr.litre, 0) || 0,
                fill: tumblerFill,
                consume: tumblerConsume,
            };

            return {
                status: true,
                message: '',
                data: data
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

    async create(payload: TumblerLogModel.CreateTumblerLog, req: Request): Promise<any> {
        try {
            const { initial_fill, ...pays } = payload;

            const resHeader: any = await this.prisma.tumblerLog.create({
                data: {
                    ...pays,
                    date_time: new Date(),
                }
            });

            if (!resHeader) {
                return {
                    status: false,
                    message: "Tumbler Log Gagal Disimpan",
                    data: null
                }
            };

            const resDetail: any = await this.prisma.tumblerFillLog.create({
                data: {
                    ...initial_fill,
                    id_tumbler_log: resHeader.id_tumbler_log,
                    created_at: new Date(),
                }
            });

            if (!resDetail) {
                return {
                    status: false,
                    message: "Tumbler Initial Fill Gagal Disimpan",
                    data: null
                }
            };

            const device_name = await this.prisma.customer.findFirst({
                where: {
                    id_customer: parseInt(req.user['id_customer'] as string)
                },
                select: {
                    device_name: true
                }
            });

            await this.notificationService.create(req, {
                title: 'Aktifitas Baru',
                description: `Aktifitas baru pada ${device_name.device_name}`,
                url: `dashboard/log`
            });

            return {
                status: true,
                message: '',
                data: resHeader
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

    async createFill(payload: TumblerLogModel.CreateTumblerFillLog, req: Request): Promise<any> {
        try {
            const todayLog = await this.prisma.tumblerLog.findFirst({
                where: {
                    id_customer: parseInt(req.user['id_customer'] as string),
                    date_time: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    },
                }
            });

            if (!todayLog) {
                return {
                    status: false,
                    message: "Tumbler Log Tidak Ditemukan",
                    data: null
                }
            }

            const res: any = await this.prisma.tumblerFillLog.create({
                data: {
                    ...payload,
                    id_tumbler_log: todayLog.id_tumbler_log,
                    created_at: new Date(),
                }
            });

            if (!res) {
                return {
                    status: false,
                    message: "Tumbler Fill Gagal Disimpan",
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

    async createConsume(payload: TumblerLogModel.CreateTumblerConsumeLog, req: Request): Promise<any> {
        try {
            console.log("user =>", req.user);

            const todayLog = await this.prisma.tumblerLog.findFirst({
                where: {
                    id_customer: parseInt(req.user['id_customer'] as string),
                    date_time: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            });

            if (!todayLog) {
                return {
                    status: false,
                    message: "Tumbler Log Tidak Ditemukan",
                    data: null
                }
            }

            const res: any = await this.prisma.tumblerConsumeLog.create({
                data: {
                    ...payload,
                    id_tumbler_log: todayLog.id_tumbler_log,
                    created_at: new Date(),
                }
            });

            if (!res) {
                return {
                    status: false,
                    message: "Tumbler Consume Gagal Disimpan",
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
