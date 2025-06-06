import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.enableCors({
    origin: ['http://localhost'], // L'adresse de ton frontend
  });

  const config = new DocumentBuilder()
    .setTitle('Gestion des Associations')
    .setDescription('Descriptions des APIs de la gestion des associations')
    .setVersion('1.0')
    .build();

  //const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(4500);
}
bootstrap();
