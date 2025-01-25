import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { ProyekModel } from './proyek.model';
import { ProyekService } from './proyek.service';

@Controller('proyek')
@ApiTags('Proyek')
export class ProyekController {

    constructor(
        private _proyekService: ProyekService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetAllProyek })
    async getAll(@Query() query: ProyekModel.IProyekQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.getAll(query);
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

    @Get('retrieve/:id_proyek')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async getById(@Param('id_proyek') id_proyek: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.getById(id_proyek);
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
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async create(@Body() body: ProyekModel.CreateProyek, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.create(req, body);
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
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async update(@Body() body: ProyekModel.UpdateProyek, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.update(body);
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

    @Put('update-nilai-kelompok')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async updateNilaiKelompok(@Body() body: ProyekModel.UpdateNilaiProyekKelompok, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.updateNilaiKelompok(req, body);
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

    @Put('update-kelompok')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async updateKelompok(@Body() body: ProyekModel.UpdateProyekKelompok, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.updateKelompok(req, body);
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

    @Delete('delete-kelompok/:id_kelompok_proyek')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async deleteKelompok(@Query('id_kelompok_proyek') id_kelompok_proyek: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.deleteKelompok(id_kelompok_proyek);
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

    @Post('add-siswa-kelompok')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async insertSiswaKelompok(@Body() body: ProyekModel.CreateNewProyekSiswaKelompok, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.insertSiswaKelompok(body);
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

    @Put('update-siswa-kelompok')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async updateSiswaKelompok(@Body() body: ProyekModel.UpdateProyekSiswaKelompok, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.updateSiswaKelompok(body);
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

    @Delete('delete-siswa-kelompok/:id_siswa_kelompok_proyek')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: ProyekModel.GetByIdProyek })
    async deleteSiswaKelompok(@Query('id_siswa_kelompok_proyek') id_siswa_kelompok_proyek: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._proyekService.deleteSiswaKelompok(id_siswa_kelompok_proyek);
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
