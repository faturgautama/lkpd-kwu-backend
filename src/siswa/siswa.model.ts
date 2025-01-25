export namespace SiswaModel {
    export class ISiswa {
        id_siswa: number;
        id_user: number;
        nama_lengkap: string;
        no_absen: string;
        id_sekolah: number;
        nama_sekolah: string;
        id_kelas: number;
        kelas: string;
        is_active: boolean;
        create_at: Date;
    }

    export class ISiswaQueryParams {
        id_kelas?: number;
        nama_lengkap?: string;
    }

    export class GetAllSiswa {
        status: boolean;
        message: string;
        data: ISiswa[]
    }

    export class GetByIdSiswa {
        status: boolean;
        message: string;
        data: ISiswa;
    }

    export class CreateSiswa {
        nama_lengkap: string;
        no_absen: string;
        id_kelas: number;
    }

    export class UpdateSiswa {
        id_siswa: number;
        nama_lengkap: string;
        no_absen: string;
        id_kelas: number;
        is_active: boolean;
    }
}