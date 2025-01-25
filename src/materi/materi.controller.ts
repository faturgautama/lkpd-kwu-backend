import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { MateriModel } from './materi.model';
import { MateriService } from './materi.service';
import { Request, Response } from 'express';

@Controller('materi')
@ApiTags('Materi')
export class MateriController {

    constructor(
        private _materiService: MateriService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: MateriModel.GetAllMateri })
    async getAll(@Query() query: MateriModel.IMateriQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._materiService.getAll(query);
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

    @Get('retrieve/:id_materi')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: MateriModel.GetByIdMateri })
    async getById(@Param('id_materi') id_materi: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._materiService.getById(id_materi);
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
    @ApiResponse({ status: 200, description: 'Success', type: MateriModel.GetByIdMateri })
    async create(@Body() body: MateriModel.CreateMateri, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._materiService.create(req, body);
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
    @ApiResponse({ status: 200, description: 'Success', type: MateriModel.GetByIdMateri })
    async update(@Body() body: MateriModel.UpdateMateri, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._materiService.update(req, body);
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

    @Delete('delete/:id_materi')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: MateriModel.GetByIdMateri })
    async delete(@Param('id_materi') id_materi: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._materiService.delete(id_materi);
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
