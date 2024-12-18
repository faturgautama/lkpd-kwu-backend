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

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetAllTumblerLog })
    async getAll(@Query() query: TumblerLogModel.TumblerLogQueryParams, @Res() res: Response): Promise<any> {
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

    @Get(':id_tumbler_log')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async getById(@Param('id_tumbler_log') id_tumbler_log: string, @Res() res: Response): Promise<any> {
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

    @Post('initial-fill')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async create(@Body() body: TumblerLogModel.CreateTumblerLog, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._tumblerLogService.create(body, req);
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

    @Post('new-fill')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async newFill(@Body() body: TumblerLogModel.CreateTumblerFillLog, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._tumblerLogService.createFill(body, req);
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

    @Post('consume')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: TumblerLogModel.GetByIdTumblerLog })
    async consume(@Body() body: TumblerLogModel.CreateTumblerConsumeLog, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._tumblerLogService.createConsume(body, req);
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
