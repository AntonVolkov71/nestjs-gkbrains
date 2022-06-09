import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './comments.entity';
import { NewsService } from '../news.service';
import { NewsEntity } from '../news.entity';

@Controller('news-comments')
export class CommentsController {
  constructor(
    private readonly commentService: CommentsService,
    private readonly newsService: NewsService,
  ) {}

  @Get('all')
  async getAll(@Query('idNews') idNews): Promise<{}> {
    const comments = await this.commentService.findAll(idNews);
    return comments;
  }

  @Post()
  async create(
    @Query() query,
    @Body('comments') comments,
  ): Promise<CommentsEntity | HttpException> {
    const { idNews, userId } = query;
    // const _news = await this.newsService.findByIndex(idNews)
    const _comments = await this.commentService.create(
      idNews,
      comments,
      userId,
    );

    // const _newsUpdateEntity = new NewsEntity();
    // _newsUpdateEntity.title = _news.title;
    // _newsUpdateEntity.description = _news.description;
    // _newsUpdateEntity.user = _news.user;
    // _newsUpdateEntity.category = _news.category;
    //
    // if (_comments instanceof CommentsEntity) {
    //     _newsUpdateEntity.comments = [..._news.comments, _comments];
    // }

    return _comments;
  }

  @Put(':idComment')
  async update(
    @Param('idComment') idComment,
    @Query('idNews') idNews,
    @Body('comments') comments,
  ): Promise<boolean> {
    return this.commentService.update(idNews, idComment, comments);
  }

  @Delete(':idComment')
  remove(
    @Param('idComment') idComment,
    @Query('idNews') idNews,
  ): Promise<boolean> {
    return this.commentService.remove(idNews, idComment);
  }

  @Delete()
  removeAll(@Query('idNews') idNews) {
    return this.commentService.removeAll(Number.parseInt(idNews));
  }
}
