import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Redirect,
  Render,
  Req,
  RequestTimeoutException,
  Res,
  Session,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';
import { htmlTemplate } from '../views/template';
import { newsTemplate } from '../views/news';
import { CommentsService } from './comments/comments.service';
import { commentsTemplate } from '../views/comments';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsUpdateDto } from './dtos/news-update.dto';
import { formImageTemplate } from '../views/formImage';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { LoggingInterceptor } from '../logging.interceptor';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

@UseInterceptors(LoggingInterceptor)
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private mailService: MailService,
  ) {}

  @Get('all')
  async getNews(@Req() request: Request, @Ip() ip): Promise<NewsEntity[]> {
    // console.log(' request.ip', request.ip);
    // console.log('ip', ip);
    // console.log('idasdasd', new Date());
    return this.newsService.findAll();
  }

  @Get('upload')
  async loadImage() {
    return htmlTemplate(formImageTemplate());
  }

  // // один файл
  // @Post('upload')
  // @UseInterceptors(
  //     FileInterceptor('file', {
  //         storage: diskStorage({
  //             destination: helperFileLoader.destinationPath,
  //             filename: helperFileLoader.customFileName,
  //         })
  //     }))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  // }

  // несколько файлов
  // @Post('upload')
  // @UseInterceptors(
  //     FilesInterceptor('file', 5, {
  //         storage: diskStorage({
  //             destination: helperFileLoader.destinationPath,
  //             filename: helperFileLoader.customFileName,
  //         })
  //     }))
  // uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
  // }

  @Get(':id')
  async getById(@Param() params: NewsIdDto): Promise<NewsEntity | undefined> {
    const news = await this.newsService.findByIndex(Number.parseInt(params.id));
    return news;
  }

  // Получить тело запроса
  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFiles() cover: Express.Multer.File,
  ): Promise<NewsEntity> {
    const authorId = news.authorId;
    const categoryId = news.categoryId;
    const _user = await this.usersService.findOne(authorId);

    if (!_user) {
      throw new HttpException(
        'Не существует такого автора',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _category = await this.categoriesService.findById(categoryId);

    if (!_category) {
      throw new HttpException(
        'Не существует такой категории',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _newsEntity = new NewsEntity();

    if (cover[0]?.filename?.length > 0) {
      _newsEntity.cover = PATH_NEWS + cover[0].filename;
    }

    _newsEntity.title = news.title;
    _newsEntity.description = news.description;
    _newsEntity.user = _user;
    _newsEntity.category = _category;
    _newsEntity.comments = [];
    // return throwError(new RequestTimeoutException()); // Выкинуть ошибку

    // TODO не работает отправка писем
    // const _news = this.newsService.create({...news, cover: coverPath});
    // await this.mailService.sendNewNewsForAdmins(
    //     ['volkovanton@yandex.ru', 'volkovdeveloper@yandex.ru'],
    //     _news,
    // );
    // return _news;

    const _news = await this.newsService.create(_newsEntity);

    // await this.mailService.sendNewNewsForAdmins(
    //     ['snezhkinv@yandex.ru', 'snezhkinv20@gmail.com'],
    //     _news,
    // );

    return _news;
  }

  @Delete(':id')
  async remove(@Param() params: NewsIdDto): Promise<boolean> {
    const isCommentRemove = await this.commentService.removeAll(
      Number.parseInt(params.id),
    );
    const isNewsRemove = await this.newsService.remove(
      Number.parseInt(params.id),
    );

    return isNewsRemove && !!isCommentRemove;
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = await this.newsService.findAll();
    const commentHtml = '';

    return htmlTemplate(newsTemplate(news, commentHtml));
  }

  @Get(':idNews/detail')
  async getViewAllComments(@Param('idNews') idNews) {
    const news = await this.newsService.findByIndex(idNews);
    return htmlTemplate(newsTemplate([news], commentsTemplate(news.comments)));
  }

  // динамический путь * любой символ из regex (можно ? + * () - . )
  @Get('person*mudak')
  @HttpCode(204) // не вернет так как NO CONTENT
  async getNewsAll(): Promise<NewsEntity[]> {
    return this.newsService.findAll();
  }

  // /news?age=32  Один парамерт
  // @Get()
  // async getNews(@Query('age') age): Promise<News[]> {
  //     console.log('age',age); // age 32
  //     return this.newsService.findAll();
  // }

  // /news?age=32&&name=anton Все параметры
  // @Get()
  // async getNews(@Query() query): Promise<News[]> {
  //     console.log('query',query); //query { age: '123123', ff: '213' }
  //     return this.newsService.findAll();
  // }

  // установка кастомных заголовок
  // @Get()
  // @Header('Cache-Control', 'none')
  // create() {
  //     return 'This action adds a new cat';
  // }

  // Header заголовки + Cookie
  // @Get()
  // findAll(@Req() request: Request): string | string[]{
  //     console.log('request  ',request.headers['host']); // localhost:3333
  //     console.log('request cookie ',request.cookies); //  or "request.cookies['cookieKey']
  // or console.log(request.signedCookies);

  //     return request.headers['host'];
  // }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  async updateNews(
    @Param() params: NewsUpdateDto,
    @Body() news: NewsUpdateDto,
    @UploadedFiles() cover: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const textError = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Cannot find news with id: ${params.id}`,
      error: 'Not Found',
    };

    const authorId = news.authorId;
    const categoryId = news.categoryId;
    const _user = await this.usersService.findOne(authorId);

    if (!_user) {
      throw new HttpException(
        'Не существует такого автора',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _category = await this.categoriesService.findById(categoryId);

    if (!_category) {
      throw new HttpException(
        'Не существует такой категории',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _newsUpdateEntity = new NewsEntity();

    if (cover[0]?.filename?.length > 0) {
      _newsUpdateEntity.cover = PATH_NEWS + cover[0].filename;
    }

    _newsUpdateEntity.title = news.title;
    _newsUpdateEntity.description = news.description;
    _newsUpdateEntity.user = _user;
    _newsUpdateEntity.category = _category;

    const _updateNews = await this.newsService.update(
      Number.parseInt(params.id),
      _newsUpdateEntity,
    );

    if (_updateNews) return _updateNews;

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(textError);
    return;
  }
}
