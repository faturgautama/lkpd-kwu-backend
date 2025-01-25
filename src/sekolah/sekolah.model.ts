export namespace SekolahModel {
    export class ISekolah {
        id_sekolah: number;
        nama_sekolah: string;
        alamat: string;
        no_telepon: string;
        kode_pos: string;
        is_active: boolean;
    }

    export class GetAllSekolah {
        status: boolean;
        message: string;
        data: ISekolah[]
    }

    export class GetByIdSekolah {
        status: boolean;
        message: string;
        data: ISekolah;
    }

    export class CreateSekolah {
        nama_sekolah: string;
        alamat: string;
        no_telepon: string;
        kode_pos: string;
    }

    export class UpdateSekolah {
        id_sekolah: number;
        nama_sekolah: string;
        alamat: string;
        no_telepon: string;
        kode_pos: string;
        is_active: boolean;
    }
}