import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CalculatorModule } from './calculator/calculator.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './logger.middleware';
import { NewsController } from './news/news.controller';
import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news/news.entity';
import { UsersEntity } from './users/users.entity';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesEntity } from './categories/categories.entity';
import { CommentsEntity } from './news/comments/comments.entity';
import { CommentsModule } from './news/comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import * as Joi from 'joi';
import { AppConfigModule } from '../config/app/config.module';
import { CatsModule } from './cats/cats.module';

interface EnvironmentVariables {
  PORT: number;
  DATABASE_USER: string;
}

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      load: [databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    NewsModule,
    CalculatorModule,
    UsersModule,
    CategoriesModule,
    CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailModule,
    TypeOrmModule.forRootAsync({
      // imports: [ConfigService, ConfigModule],
      inject: [ConfigService],
      // useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        // port: configService.get<number>('PORT',{infer: true}),
        // username: configService.get<string>('DATABASE_USER', {infer:true}),
        username: configService.get<string>('database.username'),
        // username: configService.get('DATABASE_USER'),
        // username: 'postgres',
        password: '7896348ZW',
        database: 'news_blog',
        entities: [NewsEntity, UsersEntity, CategoriesEntity, CommentsEntity],
        synchronize: true,
      }),
    }),
    // TypeOrmModule.forRoot({
    //     type: 'postgres',
    //     host: 'localhost',
    //     port: 5432,
    //     username: process.env.DATABASE_USER,
    //     password: '7896348ZW',
    //     // username: process.env.DATABASE_USER,
    //     database: 'news_blog',
    //     entities: [NewsEntity, UsersEntity, CategoriesEntity, CommentsEntity],
    //     synchronize: true,
    // }),
    AuthModule,
    CatsModule,
    // NewsEntity, UsersEntity, CategoriesEntity, CommentsEntity
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .forRoutes('news') // упрощенно
      // .forRoutes({path: 'news', method: RequestMethod.GET}) // не работает
      .forRoutes(NewsController);
    // .forRoutes({path: 'ab*cd', method: RequestMethod.ALL}) // не работает
  }
}
