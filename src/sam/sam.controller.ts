import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SamService } from './sam.service';
import { SamModel } from './sam.model';
import { Request, Response } from 'express';

@Controller('api/v1/sam')
@ApiTags('Sam')
export class SamController {

    constructor(
        private _samService: SamService,
    ) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Success', type: [SamModel.ISamUnit] })
    async getAll(@Query() query: SamModel.QueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.getAll(query.jenis, query.ukuran);
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

    @Get('beranda/:ukuran')
    @ApiResponse({ status: 200, description: 'Success', type: [SamModel.ISamUnit] })
    async getAllForBeranda(@Param('ukuran') ukuran: string, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.getAllForBeranda(ukuran);
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

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Success', type: SamModel.ISamUnit })
    async getById(@Param('id') id: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.getById(id);
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

    @Post()
    @ApiResponse({ status: 200, description: 'Success', type: SamModel.ISamUnit })
    async create(@Body() body: SamModel.CreateSamUnit, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.create(body, req);
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

    @Put()
    @ApiResponse({ status: 200, description: 'Success', type: SamModel.ISamUnit })
    async update(@Body() body: SamModel.UpdateSamUnit, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.update(body, req);
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

    @Put('delete/:id')
    @ApiResponse({ status: 200, description: 'Success', type: SamModel.ISamUnit })
    async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._samService.delete(id, req);
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
