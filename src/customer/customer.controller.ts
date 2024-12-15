import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerModel } from './customer.model';
import { Response } from 'express';
import { JwtGuard } from 'src/authentication/jwt.guard';

@Controller('v1/customer')
@ApiTags('Customer')
export class CustomerController {

    constructor(
        private _customerService: CustomerService,
    ) { }

    @Get()
    @UseGuards(JwtGuard)
    @ApiBearerAuth('token')
    @ApiResponse({ status: 200, description: 'Success', type: CustomerModel.GetAllCustomer })
    async getAll(@Res() res: Response): Promise<any> {
        try {
            const data = await this._customerService.getAll();
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
}
