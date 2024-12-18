import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication/authentication.controller';
import { jwtConstants } from './authentication/jwt.secret';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtStrategy } from './authentication/jwt.strategy';
import { TumblerLogController } from './tumbler-log/tumbler-log.controller';
import { TumblerLogService } from './tumbler-log/tumbler-log.service';
import { UtilityService } from './utility/utility.service';
import { AppGateway } from './app.gateway';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret
        })
    ],
    controllers: [
        AuthenticationController,
        CustomerController,
        TumblerLogController,
        NotificationController,
    ],
    providers: [
        CustomerService,
        PrismaService,
        AuthenticationService,
        JwtStrategy,
        UtilityService,
        TumblerLogService,
        NotificationService,
        AppGateway,
    ],
})
export class AppModule { }
