export namespace NotificationModel {
    export class INotification {
        id_notification: number
        id_customer: number
        title: string
        url: string
        description: string
        is_read: boolean
        created_at: Date
    }

    export class GetNotification {
        status: boolean;
        message: string;
        data: INotification[]
    }

    export class CreateNotification {
        title: string
        url: string
        description: string
    }

    export class UpdateNotification {
        id_notification: number
    }
}