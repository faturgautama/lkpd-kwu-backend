export namespace AuthenticationModel {
    export class ILoginCustomer {
        device_id: string;
        password: string;
    }

    export class ILoginCustomerResponse {
        id_customer: number;
        device_id: string;
        device_name: string;
        device_type: string;
        device_size: string;
        device_notes: string;
        full_name: string;
        date_of_birth: Date;
        weight: number;
        height: number;
        email: string;
        token: string;
    }

    export class LoginCustomer {
        status: boolean;
        message: string;
        data: ILoginCustomerResponse;
    }

    export class ILoginUser {
        email: string;
        password: string;
    }

    export class ILoginUserResponse {
        id_user: number;
        full_name: string;
        email: string;
        token: string;
    }

    export class LoginUser {
        status: boolean;
        message: string;
        data: ILoginUserResponse;
    }

    export class IRegisterUser {
        full_name: string;
        email: string;
        password: string;
    }
}