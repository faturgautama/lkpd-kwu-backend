import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationModel } from './authentication.model';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';

@Controller('v1/authentication')
@ApiTags('Authentication')
export class AuthenticationController {

    constructor(
        private _authenticationService: AuthenticationService,
    ) { }

    @Post('signInCustomer')
    @ApiResponse({ status: 200, description: 'Success', type: AuthenticationModel.LoginCustomer })
    async signInCustomer(@Body() body: AuthenticationModel.ILoginCustomer, @Res() res: Response): Promise<any> {
        try {
            const data = await this._authenticationService.loginCustomer(body.device_id, body.password);
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

    @Post('signInUser')
    @ApiResponse({ status: 200, description: 'Success', type: AuthenticationModel.LoginUser })
    async signInUser(@Body() body: AuthenticationModel.ILoginUser, @Res() res: Response): Promise<any> {
        try {
            const data = await this._authenticationService.loginUser(body.email, body.password);
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

    @Post('registerUser')
    @ApiResponse({ status: 200, description: 'Success', type: AuthenticationModel.LoginUser })
    async registerUser(@Body() body: AuthenticationModel.IRegisterUser, @Res() res: Response): Promise<any> {
        try {
            const data = await this._authenticationService.registerUser(body);
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
