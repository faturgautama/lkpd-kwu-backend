import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { ReferensiModel } from './referensi.model';
import { ReferensiService } from './referensi.service';

@Controller('referensi')
@ApiTags('Referensi')
export class ReferensiController {

    constructor(
        private _referensiService: ReferensiService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ReferensiModel.GetAllReferensi })
    async getAll(@Query() query: ReferensiModel.IReferensiQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._referensiService.getAll(query);
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

    @Get('retrieve/:id_referensi')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ReferensiModel.GetByIdReferensi })
    async getById(@Param('id_referensi') id_referensi: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._referensiService.getById(id_referensi);
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
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ReferensiModel.GetByIdReferensi })
    async create(@Body() body: ReferensiModel.CreateReferensi, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._referensiService.create(req, body);
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
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ReferensiModel.GetByIdReferensi })
    async update(@Body() body: ReferensiModel.UpdateReferensi, @Res() res: Response): Promise<any> {
        try {
            const data = await this._referensiService.update(body);
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

    @Delete(':id_referensi')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ReferensiModel.GetByIdReferensi })
    async delete(@Param('id_referensi') id_referensi: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._referensiService.delete(id_referensi);
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
