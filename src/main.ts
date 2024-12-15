import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const prisma = app.get(PrismaService);
    await prisma.enableShutdownHooks(app);

    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    const config = new DocumentBuilder()
        .setTitle('WEMOS API')
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
            persistAuthorization: false,  // untuk keperluan development (agar token tidak hilang saat refresh)
            docExpansion: "none"
        },
    });

    app.enableCors();
    await app.listen(process.env.PORT ?? 3055);
}
bootstrap();
