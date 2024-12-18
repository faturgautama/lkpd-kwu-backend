export namespace TumblerLogModel {
    export class ITumblerLog {
        id_tumbler_log: number
        id_customer: number
        full_name: string
        device_id: string
        device_name: string
        device_type: string
        device_size: string
        device_notes: string
        date_time: Date;
        initial_fill_litre?: number
        total_fill_litre?: number
        total_consume_litre?: number;
        fill?: ITumblerFillLog[];
        consume?: ITumblerConsumeLog[];
    }

    export class ITumblerFillLog {
        id_tumbler_log: number
        id_tumbler_fill_log: number
        litre: number
        note: string
        created_at: Date
    }

    export class ITumblerConsumeLog {
        id_tumbler_log: number
        id_tumbler_fill_log: number
        litre: number
        note: string
        created_at: Date
    }

    export class TumblerLogQueryParams {
        id_customer?: number;
        date_time?: Date;
    }

    export class GetAllTumblerLog {
        status: boolean;
        message: string;
        data: ITumblerLog[];
    }

    export class GetByIdTumblerLog {
        status: boolean;
        message: string;
        data: ITumblerLog;
    }

    export class CreateTumblerLog {
        id_customer: number
        initial_fill: {
            litre: number
            note: string
        }
    }

    export class CreateTumblerFillLog {
        litre: number
        note: string
    }

    export class CreateTumblerConsumeLog {
        litre: number
        note: string
    }
}