import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { CategoriesService } from '../categories/categories.service';
import { CommentsService } from './comments/comments.service';
import { CategoriesEntity } from '../categories/categories.entity';
import { CommentsEntity } from './comments/comments.entity';

@Module({
  controllers: [NewsController],
  providers: [NewsService, UsersService, CategoriesService, CommentsService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      NewsEntity,
      CategoriesEntity,
      CommentsEntity,
    ]),
  ],
  exports: [NewsService],
})
export class NewsModule {}
