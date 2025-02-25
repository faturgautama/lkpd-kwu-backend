import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { KuisModel } from './kuis.model';
import { KuisService } from './kuis.service';
import { Request, Response } from 'express';

@Controller('kuis')
@ApiTags('Kuis')
export class KuisController {

    constructor(
        private _kuisService: KuisService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetAllKuis })
    async getAll(@Query() query: KuisModel.IKuisQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.getAll(query);
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

    @Get('retrieve/:id_kuis')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async getById(@Param('id_kuis') id_kuis: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.getById(id_kuis);
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

    @Get('retrieve-with-answer/:id_kuis/:id_siswa')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async getByIdWithAnswer(@Param('id_kuis') id_kuis: number, @Param('id_siswa') id_siswa: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.getKuisWithJawaban(id_kuis, id_siswa);
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
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async create(@Body() body: KuisModel.CreateKuis, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.create(req, body);
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
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async update(@Body() body: KuisModel.UpdateKuis, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.update(body);
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

    @Post('add-pertanyaan')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async insertPertanyaan(@Body() body: KuisModel.CreateNewPertanyaanKuis, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.insertPertanyaan(req, body);
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

    @Put('update-pertanyaan')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async updatePertanyaan(@Body() body: KuisModel.UpdatePertanyaanKuis, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.updatePertanyaan(req, body);
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

    @Delete('delete-pertanyaan/:id_pertanyaan')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async deletePertanyaan(@Query('id_pertanyaan') id_pertanyaan: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.deletePertanyaan(id_pertanyaan);
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

    @Post('insert-jawaban')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async insertJawaban(@Body() body: KuisModel.CreateJawabanKuis, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.insertMultiJawaban(req, body);
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

    @Put('penilaian-jawaban')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: KuisModel.GetByIdKuis })
    async penilaianJawaban(@Body() body: KuisModel.NilaiJawabanKuis, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._kuisService.penilaianJawaban(req, body);
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
