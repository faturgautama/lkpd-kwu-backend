export namespace CustomerModel {
    export class ICustomer {
        id_customer: number
        device_id: string
        device_name: string
        device_type: string
        device_size: string
        device_notes: string
        full_name: string
        date_of_birth: Date
        weight: number
        height: number
        email: string
        password: string
        created_at: Date
        created_by: number
        updated_at: Date
        updated_by: number
        is_active: boolean
    }

    export class ICustomerQueryParams {
        full_name?: string
        device_id?: string;
        email?: string;
        is_active?: boolean;
    }

    export class GetAllCustomer {
        status: boolean;
        message: string;
        data: ICustomer[];
    }

    export class GetByIdCustomer {
        status: boolean;
        message: string;
        data: ICustomer;
    }

    export class CreateCustomer {
        device_id: string
        device_name: string
        device_type: string
        device_size: string
        device_notes: string
        full_name: string
        date_of_birth: Date
        weight: number
        height: number
        email: string
        password: string
    }

    export class UpdateCustomer {
        id_customer: number
        device_id: string
        device_name: string
        device_type: string
        device_size: string
        device_notes: string
        full_name: string
        date_of_birth: Date
        weight: number
        height: number
        email: string
        password: string
        updated_by: number
        is_active: boolean
    }

    export class IWeeklyAndTodayConsume {
        date_time: Date;
        litre: number;
    }

    export class IReportCustomer {
        total_fill: number;
        total_fill_today: number;
        total_consume: number;
        total_consume_today: number;
        weekly_consume: IWeeklyAndTodayConsume[];
        today_consume: IWeeklyAndTodayConsume[];
    }

    export class GetReportCustomer {
        status: boolean;
        message: string;
        data: IReportCustomer;
    }
}