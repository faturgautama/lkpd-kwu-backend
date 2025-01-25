import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { SiswaModel } from './siswa.model';
import { SiswaService } from './siswa.service';

@Controller('siswa')
@ApiTags('Siswa')
export class SiswaController {

    constructor(
        private _siswaService: SiswaService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: SiswaModel.GetAllSiswa })
    async getAll(@Query() query: SiswaModel.ISiswaQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._siswaService.getAll(query);
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

    @Get('retrieve/:id_siswa')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: SiswaModel.GetByIdSiswa })
    async getById(@Param('id_siswa') id_siswa: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._siswaService.getById(id_siswa);
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
    @ApiResponse({ status: 200, description: 'Success', type: SiswaModel.GetByIdSiswa })
    async create(@Body() body: SiswaModel.CreateSiswa, @Res() res: Response): Promise<any> {
        try {
            const data = await this._siswaService.create(body);
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
    @ApiResponse({ status: 200, description: 'Success', type: SiswaModel.GetByIdSiswa })
    async update(@Body() body: SiswaModel.UpdateSiswa, @Res() res: Response): Promise<any> {
        try {
            const data = await this._siswaService.update(body);
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
