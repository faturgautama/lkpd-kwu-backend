export namespace ReferensiModel {
    export class IReferensi {
        id_referensi: number;
        judul: string;
        deskripsi: string;
        link: string;
        create_at: Date;
        create_by: number;
    }

    export class IReferensiQueryParams {
        judul?: string;
    }

    export class GetAllReferensi {
        status: boolean;
        message: string;
        data: IReferensi[]
    }

    export class GetByIdReferensi {
        status: boolean;
        message: string;
        data: IReferensi;
    }

    export class CreateReferensi {
        judul: string;
        deskripsi: string;
        link: string;
    }

    export class UpdateReferensi {
        id_referensi: number;
        judul: string;
        deskripsi: string;
        link: string;
    }
}