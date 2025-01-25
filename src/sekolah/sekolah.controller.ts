import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { SekolahService } from './sekolah.service';
import { SekolahModel } from './sekolah.model';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { Request, Response } from 'express';

@Controller('sekolah')
@ApiTags('Sekolah')
export class SekolahController {

    constructor(
        private _sekolahService: SekolahService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: SekolahModel.GetAllSekolah })
    async getAll(@Res() res: Response): Promise<any> {
        try {
            const data = await this._sekolahService.getAll();
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

    @Get('retrieve/:id_sekolah')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: SekolahModel.GetByIdSekolah })
    async getById(@Param('id_sekolah') id_sekolah: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._sekolahService.getById(id_sekolah);
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
    @ApiResponse({ status: 200, description: 'Success', type: SekolahModel.GetByIdSekolah })
    async create(@Body() body: SekolahModel.CreateSekolah, @Res() res: Response): Promise<any> {
        try {
            const data = await this._sekolahService.create(body);
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
    @ApiResponse({ status: 200, description: 'Success', type: SekolahModel.GetByIdSekolah })
    async update(@Body() body: SekolahModel.UpdateSekolah, @Res() res: Response): Promise<any> {
        try {
            const data = await this._sekolahService.update(body);
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
