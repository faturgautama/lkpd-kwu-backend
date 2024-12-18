import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerModel } from './customer.model';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/authentication/jwt.guard';

@Controller('api/v1/customer')
@ApiTags('Customer')
export class CustomerController {

    constructor(
        private _customerService: CustomerService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: CustomerModel.GetAllCustomer })
    async getAll(@Param('query') query: CustomerModel.ICustomerQueryParams, @Res() res: Response): Promise<any> {
        try {
            const data = await this._customerService.getAll(query);
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

    @Get(':id_customer')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: CustomerModel.GetByIdCustomer })
    async getById(@Param('id_customer') id_customer: number, @Res() res: Response): Promise<any> {
        try {
            const data = await this._customerService.getById(id_customer);
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
    @ApiResponse({ status: 200, description: 'Success', type: CustomerModel.GetByIdCustomer })
    async create(@Body() body: CustomerModel.CreateCustomer, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._customerService.create(body, req);
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
    @ApiResponse({ status: 200, description: 'Success', type: CustomerModel.GetByIdCustomer })
    async update(@Body() body: CustomerModel.UpdateCustomer, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const data = await this._customerService.update(body, req);
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
