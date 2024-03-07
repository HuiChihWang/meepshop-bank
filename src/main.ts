import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setUpSwaggerInApp(path: string, app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Banking API')
    .setDescription('Banking API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(path, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setUpSwaggerInApp('api-doc', app);

  const appConfigService = app.get(AppConfigService);
  const appPort = appConfigService.getAppPort();
  Logger.log(`start app at port ${appPort}`);
  await app.listen(appPort);
}

bootstrap();
