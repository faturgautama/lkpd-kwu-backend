import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { NotificationModel } from "./notification.model";
import { AppGateway } from "src/app.gateway";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NotificationService {

    constructor(
        private prisma: PrismaService,
        private readonly appGateway: AppGateway,
    ) { }

    async getCount(req: Request): Promise<[boolean, any]> {
        try {
            const res = await this.prisma.notification.count({
                where: {
                    id_customer: parseInt(req.user['id_customer'] as any),
                    is_read: false
                },
            });

            if (res) {
                return [true, res];
            } else {
                return [true, 0]
            };

        } catch (error) {
            throw error;
        }
    }

    async getAll(req: Request): Promise<[boolean, any]> {
        try {
            const res = await this.prisma.notification.findMany({
                where: {
                    id_customer: parseInt(req.user['id_customer'] as any)
                },
                orderBy: {
                    created_at: "desc"
                }
            });

            if (res) {
                return [true, res];
            } else {
                return [false, []]
            };

        } catch (error) {
            throw error;
        }
    }

    async create(req: Request, data: NotificationModel.CreateNotification): Promise<[boolean, any]> {
        try {
            if (req.user['id_customer']) {
                const res = await this.prisma.notification.create({
                    data: {
                        id_customer: parseInt(req.user['id_customer'] as any),
                        title: data.title,
                        url: data.url,
                        description: data.description,
                        is_read: false,
                        created_at: new Date(),
                    }
                });

                if (res) {
                    this.appGateway.handleSendNotif([parseInt(req.user['id_customer'] as any)])

                    return [true, res];
                } else {
                    return [false, null]
                };
            } else {
                return [true, null];
            }

        } catch (error) {
            throw error;
        }
    }

    async update(id: number): Promise<[boolean, any]> {
        try {
            const res = await this.prisma.notification.update({
                where: {
                    id_notification: parseInt(id as any)
                },
                data: {
                    is_read: true,
                }
            });

            if (res) {
                return [true, res];
            } else {
                return [false, []]
            };

        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, any]> {
        try {
            const res = await this.prisma.notification.delete({
                where: {
                    id_notification: parseInt(id as any)
                }
            });

            if (res) {
                return [true, res];
            } else {
                return [false, []]
            };

        } catch (error) {
            throw error;
        }
    }

}