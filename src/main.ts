import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.enableShutdownHooks()
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('LKPD KWU API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('api')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'token'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: "none"
        },
    });

    await app.listen(process.env.PORT || 3057);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
