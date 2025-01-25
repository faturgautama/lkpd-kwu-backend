import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication/authentication.controller';
import { jwtConstants } from './authentication/jwt.secret';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtStrategy } from './authentication/jwt.strategy';
import { UtilityService } from './utility/utility.service';
import { SekolahController } from './sekolah/sekolah.controller';
import { SekolahService } from './sekolah/sekolah.service';
import { KelasController } from './kelas/kelas.controller';
import { KelasService } from './kelas/kelas.service';
import { GuruController } from './guru/guru.controller';
import { GuruService } from './guru/guru.service';
import { SiswaController } from './siswa/siswa.controller';
import { SiswaService } from './siswa/siswa.service';
import { MateriController } from './materi/materi.controller';
import { MateriService } from './materi/materi.service';
import { ProyekController } from './proyek/proyek.controller';
import { ProyekService } from './proyek/proyek.service';
import { KuisController } from './kuis/kuis.controller';
import { KuisService } from './kuis/kuis.service';
import { ReferensiController } from './referensi/referensi.controller';
import { ReferensiService } from './referensi/referensi.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret
        })
    ],
    controllers: [
        AuthenticationController,
        SekolahController,
        KelasController,
        GuruController,
        SiswaController,
        MateriController,
        ProyekController,
        KuisController,
        ReferensiController,
    ],
    providers: [
        JwtStrategy,
        PrismaService,
        UtilityService,
        AuthenticationService,
        SekolahService,
        KelasService,
        GuruService,
        SiswaService,
        MateriService,
        ProyekService,
        KuisService,
        ReferensiService,
    ],
})
export class AppModule { }
