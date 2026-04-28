import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export async function setupSwagger(app: INestApplication, path: string) {
    const config = new DocumentBuilder()
        .setTitle('Fripouilles API')
        .setDescription("API du projet d'AP - Les Fripouilles")
        .setVersion('1.0.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header',
            name: 'Authorization',
        }, 'bearer')
        .addSecurityRequirements('bearer')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(path, app, documentFactory, {
        jsonDocumentUrl: `/${path}/json`,
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
            filter: true,
            showRequestDuration: true,
            urls: [
                { url: `/${path}/json`, name: 'JSON' },
            ],
        },
        customSiteTitle: "Fripouilles API Documentation",
    });
}