export namespace SimulasiModel {
    export class ISimulasi {
        id_simulasi: number;
        id_kelas: number;
        kelas: string;
        judul: string
        petunjuk_pengerjaan: string
        bahan_dan_alat: string
        hasil_yang_diharapkan: string
        ilustrasi: string
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_active: boolean;
    }

    export class IJawabanSimulasi {
        id_jawaban_simulasi: number;
        id_simulasi: number;
        id_siswa: number;
        no_absen: string;
        nama_lengkap: string;
        untuk: string;
        dept: string;
        tanggal: string;
        waktu: string;
        dari: string;
        perusahaan: string;
        telepon: string;
        isi_pesan: string;
        keterangan: string;
        nama_penerima: string;
        nilai: number;
        link_video_youtube: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export class ISimulasiWithDetail {
        id_simulasi: number;
        id_kelas: number;
        kelas: string;
        judul: string
        petunjuk_pengerjaan: string
        bahan_dan_alat: string
        hasil_yang_diharapkan: string
        ilustrasi: string
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_active: boolean;
        jawaban_simulasi: IJawabanSimulasi
    }

    export class ISimulasiQueryParams {
        id_kelas?: number;
        id_siswa?: number;
    }

    export class GetByIdSimulasi {
        status: boolean;
        message: string;
        data: ISimulasiWithDetail;
    }

    export class NilaiJawabanSimulasi {
        id_simulasi: number;
        id_siswa: number;
        nilai: number;
    }

    export class UpdateJawabanSimulasi {
        id_simulasi: number;
        id_siswa: number;
        untuk: string;
        dept: string;
        tanggal: string;
        waktu: string;
        dari: string;
        perusahaan: string;
        telepon: string;
        isi_pesan: string;
        keterangan: string;
        nama_penerima: string;
        nilai: number;
        link_video_youtube: string;
    }
}