import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SiswaModel } from './siswa.model';

@Injectable()
export class SiswaService {

    constructor(
        private _prismaService: PrismaService,
    ) { }

    async getAll(query: SiswaModel.ISiswaQueryParams): Promise<SiswaModel.GetAllSiswa> {
        try {
            let res = await this._prismaService
                .siswa
                .findMany({
                    where: Object.keys(query).reduce((aggregate, property) => {
                        if (property == 'id_kelas') {
                            aggregate[property] = parseInt(query[property] as any);
                        }
                        return aggregate;
                    }, {}),
                    include: {
                        kelas: {
                            include: {
                                sekolah: {
                                    select: {
                                        id_sekolah: true,
                                        nama_sekolah: true,
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        id_siswa: 'asc'
                    }
                });

            let siswa: any[] = [];

            for (let item of (res as any)) {
                let user = await this._prismaService.user.findFirst({
                    where: {
                        id_siswa: parseInt(item.id_siswa)
                    },
                    select: {
                        id_user: true
                    }
                });

                item.id_user = user ? user.id_user : 0;
                siswa.push(item);
            }

            if (!res) {
                return {
                    status: false,
                    message: 'Something went wrong!',
                    data: null
                }
            }

            return {
                status: true,
                message: '',
                data: siswa.map((item) => {
                    return {
                        id_siswa: item.id_siswa,
                        id_user: item.id_user,
                        nama_lengkap: item.nama_lengkap,
                        no_absen: item.no_absen,
                        id_sekolah: item.kelas.sekolah.id_sekolah,
                        nama_sekolah: item.kelas.sekolah.nama_sekolah,
                        id_kelas: item.kelas.id_kelas,
                        kelas: item.kelas.kelas,
                        is_active: item.is_active,
                        create_at: item.create_at
                    }
                }).sort((a, b) => parseInt(a.id_siswa as any) - parseInt(b.id_siswa as any))
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getById(id_siswa: number): Promise<SiswaModel.GetByIdSiswa> {
        try {
            let res: any = await this._prismaService
                .siswa
                .findUnique({
                    where: { id_siswa: parseInt(id_siswa as any) },
                    include: {
                        kelas: {
                            include: {
                                sekolah: {
                                    select: {
                                        id_sekolah: true,
                                        nama_sekolah: true,
                                    }
                                }
                            }
                        }
                    },
                });

            let user = await this._prismaService.user.findFirst({
                where: {
                    id_siswa: parseInt(res.id_siswa)
                },
                select: {
                    id_user: true
                }
            });

            res.id_user = user ? user.id_user : 0;

            return {
                status: true,
                message: '',
                data: {
                    id_siswa: res.id_siswa,
                    id_user: res.id_user,
                    nama_lengkap: res.nama_lengkap,
                    no_absen: res.no_absen,
                    id_sekolah: res.kelas.sekolah.id_sekolah,
                    nama_sekolah: res.kelas.sekolah.nama_sekolah,
                    id_kelas: res.kelas.id_kelas,
                    kelas: res.kelas.kelas,
                    is_active: res.is_active,
                    create_at: res.create_at
                }
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(payload: SiswaModel.CreateSiswa): Promise<any> {
        try {
            let res = await this._prismaService
                .siswa
                .create({
                    data: {
                        ...payload,
                        create_at: new Date()
                    }
                })

            return {
                status: true,
                message: '',
                data: res
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(payload: SiswaModel.UpdateSiswa): Promise<any> {
        try {
            const { id_siswa, ...data } = payload

            let res = await this._prismaService
                .siswa
                .update({
                    where: { id_siswa: parseInt(id_siswa as any) },
                    data: data
                })

            return {
                status: true,
                message: '',
                data: res
            }

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
