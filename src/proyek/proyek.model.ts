export namespace ProyekModel {
    export class IProyek {
        id_proyek: number;
        id_kelas: number;
        kelas: string;
        judul: string;
        deskripsi: string;
        create_at: Date;
        create_by: number;
        is_active: boolean;
    }

    export class IKelompokProyek {
        id_kelompok_proyek: number;
        kelompok_proyek: string;
        id_proyek: number;
        judul_proyek: string;
        hasil: string;
        nilai_pertemuan_1: number;
        nilai_pertemuan_2: number;
        nilai_pertemuan_3: number;
        nilai_pertemuan_4: number;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_active: boolean;
        detail_siswa: ISiswaKelompokProyek[]
    }

    export class ISiswaKelompokProyek {
        id_siswa_kelompok_proyek: number;
        id_kelompok_proyek: number;
        kelompok_proyek: string;
        id_user: number;
        id_siswa: number;
        no_absen: string;
        nama_lengkap: string;
    }

    export class IProyekWithDetail {
        id_proyek: number;
        id_kelas: number;
        kelas: string;
        judul: string;
        deskripsi: string;
        create_at: Date;
        create_by: number;
        is_active: boolean;
        kelompok: IKelompokProyek[]
    }

    export class IProyekQueryParams {
        id_kelas?: number;
        judul?: string;
        kelompok_proyek?: string;
        id_siswa?: number;
    }

    export class GetAllProyek {
        status: boolean;
        message: string;
        data: IProyek[]
    }

    export class GetByIdProyek {
        status: boolean;
        message: string;
        data: IProyekWithDetail;
    }

    export class CreateProyekKelompok {
        kelompok_proyek: string;
        detail_siswa: CreateProyekSiswaKelompok[]
    }

    export class CreateNewProyekKelompok {
        id_proyek: number;
        kelompok_proyek: string;
        detail_siswa: CreateProyekSiswaKelompok[]
    }

    export class CreateProyekSiswaKelompok {
        id_user: number;
        id_siswa: number;
    }

    export class CreateProyek {
        id_kelas: number;
        judul: string;
        deskripsi: string;
        kelompok: CreateProyekKelompok[]
    }

    export class UpdateProyek {
        id_proyek: number;
        id_kelas: number;
        judul: string;
        deskripsi: string;
    }

    export class UpdateNilaiProyekKelompok {
        id_kelompok_proyek: string;
        nilai_pertemuan_1: number;
        nilai_pertemuan_2: number;
        nilai_pertemuan_3: number;
        nilai_pertemuan_4: number;
    }

    export class UpdateProyekKelompok {
        id_kelompok_proyek: string;
        kelompok_proyek: string;
        hasil: string;
    }

    export class UpdateProyekSiswaKelompok {
        id_siswa_kelompok_proyek: number;
        id_user: number;
        id_siswa: number;
    }

    export class CreateNewProyekSiswaKelompok {
        id_kelompok_proyek: number;
        id_user: number;
        id_siswa: number;
    }
}