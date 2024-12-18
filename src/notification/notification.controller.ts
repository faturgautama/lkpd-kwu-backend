import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { NotificationModel } from "./notification.model";
import { JwtGuard } from "src/authentication/jwt.guard";
import { Request, Response } from "express";

@Controller('api/v1/notification')
@ApiTags('Notification')
export class NotificationController {

    constructor(
        private _notificationService: NotificationService,
    ) { }

    @Get('GetCount')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NotificationModel.GetNotification })
    async getCount(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._notificationService.getCount(req);

            let result = {
                status: data[0],
                message: '',
                data: data[1],
            };

            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message,
                data: null
            })
        }
    }

    @Get('GetAll')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NotificationModel.GetNotification })
    async getAll(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._notificationService.getAll(req);

            let result = {
                status: data[0],
                message: '',
                data: data[1],
            };

            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message,
                data: null
            })
        }
    }

    @Post('Create')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NotificationModel.GetNotification })
    async create(@Body() payload: NotificationModel.CreateNotification, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._notificationService.create(req, payload);

            let result = {
                status: data[0],
                message: '',
                data: data[1],
            };

            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message,
                data: null
            })
        }
    }

    @Put('Update')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NotificationModel.GetNotification })
    async update(@Body() payload: NotificationModel.UpdateNotification, @Res() res: Response): Promise<any> {
        try {
            const data = await this._notificationService.update(payload.id_notification);

            let result = {
                status: data[0],
                message: '',
                data: data[1],
            };

            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message,
                data: null
            })
        }
    }

    @Put('Delete/:id')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NotificationModel.GetNotification })
    async delete(@Param('id') id: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._notificationService.delete(id);

            let result = {
                status: data[0],
                message: '',
                data: data[1],
            };

            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message,
                data: null
            })
        }
    }
}