import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthenticationModel } from './authentication.model';

@Injectable()
export class AuthenticationService {

    constructor(
        private _jwtService: JwtService,
        private _prismaService: PrismaService,
    ) { }

    async loginCustomer(device_id: string, password: string): Promise<AuthenticationModel.LoginCustomer> {
        try {
            const customer = await this._prismaService.customer.findFirst({
                where: {
                    device_id: device_id,
                }
            });

            console.log("customer =>", customer);

            if (!customer) {
                return {
                    status: false,
                    message: "User Tidak Ditemukan",
                    data: null,
                }
            }

            const match = password == customer.password

            console.log("is password match =>", match);

            if (!match) {
                return {
                    status: false,
                    message: "Mohon Periksa Device Id / Password Anda",
                    data: null as any,
                }
            }

            const token = this._jwtService.sign({
                id_customer: customer.id_customer,
                id_user: null,
                full_name: customer.full_name,
                email: customer.email,
                is_customer: true,
            });

            return {
                status: true,
                message: "OK",
                data: {
                    id_customer: customer.id_customer,
                    device_id: customer.device_id,
                    device_name: customer.device_name,
                    device_type: customer.device_type,
                    device_size: customer.device_size,
                    device_notes: customer.device_notes,
                    full_name: customer.full_name,
                    date_of_birth: new Date(customer.date_of_birth),
                    weight: customer.weight,
                    height: customer.height,
                    email: customer.email,
                    token: token,
                }
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async loginUser(email: string, password: string): Promise<AuthenticationModel.LoginUser> {
        try {
            const user = await this._prismaService.user.findFirst({
                where: {
                    email: email,
                }
            });

            console.log("user =>", user);

            if (!user) {
                return {
                    status: false,
                    message: "User Tidak Ditemukan",
                    data: null,
                }
            }

            const match = await bcrypt.compare(password, user.password);

            console.log("is password match =>", match);

            if (!match) {
                return {
                    status: false,
                    message: "Mohon Periksa Email / Password Anda",
                    data: null as any,
                }
            }

            const token = this._jwtService.sign({
                id_customer: null,
                id_user: user.id_user,
                full_name: user.full_name,
                email: user.email,
                is_customer: false,
            });

            return {
                status: true,
                message: "OK",
                data: {
                    id_user: user.id_user,
                    full_name: user.full_name,
                    email: user.email,
                    token: token,
                }
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async registerUser(payload: AuthenticationModel.IRegisterUser): Promise<{ result: boolean, message: string, data: any }> {
        try {
            console.log("register api hitted ....")

            const employee = await this._prismaService.user.findFirst({
                where: {
                    email: payload.email,
                }
            });

            console.log("cari data employee di db =>", employee)

            if (employee) {
                return {
                    result: false,
                    message: "Email Sudah Terdaftar",
                    data: null,
                }
            }

            const salt = await bcrypt.genSalt();

            const createUser = await this._prismaService.user.create({
                data: {
                    full_name: payload.full_name,
                    email: payload.email,
                    password: await bcrypt.hash(payload.password, salt),
                    created_at: new Date(),
                    is_active: true,
                    created_by: 0,
                }
            });

            if (createUser) {
                return {
                    result: true,
                    message: "User Berhasil Didaftarkan",
                    data: null,
                }
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
