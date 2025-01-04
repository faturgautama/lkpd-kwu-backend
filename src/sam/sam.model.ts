export namespace SamModel {
    export class QueryParams {
        jenis?: string;
        ukuran?: string;
    }

    export class ISamUnit {
        id: number;
        harga: number;
        unit: string
        jenis: string
        merk: string
        ukuran: string
        short_description: string
        description: string
        path_foto: string[]
    }

    export class CreateSamUnit {
        harga: number;
        unit: string
        jenis: string
        merk: string
        ukuran: string
        short_description: string
        description: string
        path_foto: string[]
    }

    export class UpdateSamUnit {
        id: number;
        harga: number;
        unit: string
        jenis: string
        merk: string
        ukuran: string
        short_description: string
        description: string
        path_foto: string[]
    }
}