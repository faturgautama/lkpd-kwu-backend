import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { NilaiService } from './nilai.service';
import { Request, Response } from 'express';
import { NilaiModel } from './nilai.model';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';

@Controller('nilai')
@ApiTags('Nilai')
export class NilaiController {

    constructor(
        private _nilaiService: NilaiService,
    ) { }

    @Get('per-kelas/:id_kelas')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NilaiModel.GetNilaiByKelas })
    async getAll(@Param('id_kelas') id_kelas: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._nilaiService.getAll(id_kelas);
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

    @Get('per-siswa/:id_siswa')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NilaiModel.GetNilaiForSiswa })
    async getPerSiswa(@Param('id_siswa') id_siswa: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._nilaiService.getPerSiswa(id_siswa);
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

    @Get('sync-sheet')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: NilaiModel.GetNilaiForSiswa })
    async syncToSpreadsheet(@Res() res: Response): Promise<any> {
        try {
            const data = await this._nilaiService.syncToSheet();
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
