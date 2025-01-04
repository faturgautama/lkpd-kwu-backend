import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TumblerLogService } from './tumbler-log.service';
import { TumblerLogModel } from './tumbler-log.model';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { Request, Response } from 'express';

@Controller('api/v1/tumbler-log')
@ApiTags('Tumbler Log')
export class TumblerLogController {

    constructor(
        private _tumblerLogService: TumblerLogService,
    ) { }

    @Get('get-all')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetAllTumblerLog })
    async getAll(@Query() query: TumblerLogModel.TumblerLogQueryParams, @Res() res: Response): Promise<any> {
        console.log("api get all hitted");

        try {
            const data = await this._tumblerLogService.getAll(query);
            return res.status(HttpStatus.OK).json(data);

        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }

    @Get('detail/:id_tumbler_log')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async getById(@Param('id_tumbler_log') id_tumbler_log: string, @Res() res: Response): Promise<any> {
        console.log("api get by id hitted");

        try {
            const data = await this._tumblerLogService.getById(id_tumbler_log);
            return res.status(HttpStatus.OK).json(data);

        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }

    @Get('fill/initial')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async create(@Query() query: TumblerLogModel.CreateTumblerLog, @Res() res: Response): Promise<any> {
        console.log("api initial fill hitted");

        try {
            const data = await this._tumblerLogService.create(query);
            return res.status(HttpStatus.OK).json(data);

        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }

    @Get('fill/new')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async newFill(@Query() query: TumblerLogModel.CreateTumblerFillLog, @Res() res: Response): Promise<any> {
        console.log("api new fill hitted");

        try {
            const data = await this._tumblerLogService.createFill(query);
            return res.status(HttpStatus.OK).json(data);

        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }

    @Get('consume/new')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async consume(@Query() query: TumblerLogModel.CreateTumblerConsumeLog, @Res() res: Response): Promise<any> {
        console.log("api consume hitted");

        try {
            const data = await this._tumblerLogService.createConsume(query);
            return res.status(HttpStatus.OK).json(data);

        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }
}
