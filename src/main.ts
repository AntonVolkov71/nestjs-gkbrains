import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';
import { AppConfigService } from '../config/app/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.enableCors();
  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get(AppConfigService);
  // app.engine(
  //     'hbs',
  //     expressHbs.engine({
  //       layoutsDir: join(__dirname, '..', 'views/layouts'),
  //       defaultLayout: 'layout',
  //       extname: 'hbs',
  //     }),
  // );
  // hbs.registerPartials(__dirname + '/views/partials');
  // app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Blogs ')
    .setDescription('The blog news')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(appConfig.port);
}

bootstrap();
