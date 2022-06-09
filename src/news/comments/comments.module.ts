import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';
import { CommentsEntity } from './comments.entity';
// import { SocketCommentsGateway } from './socket-comments.gateway';

@Module({
  providers: [CommentsService, UsersService, NewsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity, UsersEntity, NewsEntity]),
  ],
})
export class CommentsModule {}
