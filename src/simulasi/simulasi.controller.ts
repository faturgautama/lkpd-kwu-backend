import { Body, Controller, Get, HttpStatus, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimulasiService } from './simulasi.service';
import { SimulasiModel } from './simulasi.model';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { Request, Response } from 'express';

@Controller('simulasi')
@ApiTags('Simulasi')
export class SimulasiController {

    constructor(
        private _simulasiService: SimulasiService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: SimulasiModel.GetByIdSimulasi })
    async getAll(@Query() query: SimulasiModel.ISimulasiQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._simulasiService.getKuisWithJawaban(query);
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
    @ApiResponse({ status: 200, description: 'Success', type: SimulasiModel.GetByIdSimulasi })
    async update(@Body() body: SimulasiModel.UpdateJawabanSimulasi, @Res() res: Response): Promise<any> {
        try {
            const data = await this._simulasiService.updateJawaban(body);
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
