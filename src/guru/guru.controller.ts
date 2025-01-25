import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { GuruModel } from './guru.model';
import { GuruService } from './guru.service';
import { Request, Response } from 'express';

@Controller('guru')
@ApiTags('Guru')
export class GuruController {

    constructor(
        private _guruService: GuruService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: GuruModel.GetAllGuru })
    async getAll(@Res() res: Response): Promise<any> {
        try {
            const data = await this._guruService.getAll();
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

    @Get('retrieve/:id_guru')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: GuruModel.GetByIdGuru })
    async getById(@Param('id_guru') id_guru: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._guruService.getById(id_guru);
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
    @ApiResponse({ status: 200, description: 'Success', type: GuruModel.GetByIdGuru })
    async create(@Body() body: GuruModel.CreateGuru, @Res() res: Response): Promise<any> {
        try {
            const data = await this._guruService.create(body);
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
    @ApiResponse({ status: 200, description: 'Success', type: GuruModel.GetByIdGuru })
    async update(@Body() body: GuruModel.UpdateGuru, @Res() res: Response): Promise<any> {
        try {
            const data = await this._guruService.update(body);
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
