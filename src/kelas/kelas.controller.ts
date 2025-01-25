import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { KelasModel } from './kelas.model';
import { KelasService } from './kelas.service';
import { Request, Response } from 'express';

@Controller('kelas')
@ApiTags('Kelas')
export class KelasController {

    constructor(
        private _kelasService: KelasService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KelasModel.GetAllKelas })
    async getAll(@Res() res: Response): Promise<any> {
        try {
            const data = await this._kelasService.getAll();
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

    @Get('retrieve/:id_kelas')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KelasModel.GetByIdKelas })
    async getById(@Param('id_kelas') id_kelas: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kelasService.getById(id_kelas);
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
    @ApiResponse({ status: 200, description: 'Success', type: KelasModel.GetByIdKelas })
    async create(@Body() body: KelasModel.CreateKelas, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kelasService.create(body);
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
    @ApiResponse({ status: 200, description: 'Success', type: KelasModel.GetByIdKelas })
    async update(@Body() body: KelasModel.UpdateKelas, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kelasService.update(body);
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
