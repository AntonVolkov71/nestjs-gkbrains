import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
  ) {}

  async create(
    idNews: number,
    message: string,
    userId: number,
  ): Promise<CommentsEntity | HttpException> {
    const _news = await this.newsService.findByIndex(idNews);
    const _user = await this.userService.findOne(userId);
    if (!_news || !_user) {
      throw new HttpException(
        'Не существует такой новости',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _commentEntity = new CommentsEntity();
    _commentEntity.message = message;
    _commentEntity.user = _user;
    _commentEntity.news = _news;
    // _commentEntity.news = _news;

    return await this.commentsRepository.save(_commentEntity);
  }

  async findAll(idNews: number): Promise<CommentsEntity[] | undefined> {
    const _news = await this.newsService.findByIndex(idNews);
    return await this.commentsRepository.find({
      where: { news: _news },
      relations: ['user'],
    });
  }

  // async findById(id: number): Promise<CommentsEntity> {
  //     return await this.commentsRepository.findOne({
  //         where: {news: id},
  //         relations: ['news'],
  //     });
  // }

  async remove(idNews: number, idComment: number): Promise<boolean> {
    const _comments = await this.commentsRepository.find({
      where: {
        id: idComment,
      },
      relations: ['news'],
    });
    const commentsRemove = [];
    for (const comment of _comments) {
      if (comment.news.id === idNews) commentsRemove.push(comment);
    }

    return !!(await this.commentsRepository.remove(_comments));
  }

  async removeAll(idNews: number) {
    const _comments = await this.commentsRepository.find({
      relations: ['news'],
    });

    const commentsRemove = [];
    for (const comment of _comments) {
      if (comment.news.id === idNews) commentsRemove.push(comment);
    }

    return await this.commentsRepository.remove(commentsRemove);
  }

  async update(
    idNews: number,
    idComment: number,
    message: string,
  ): Promise<boolean> {
    const _comments = await this.commentsRepository.find({
      where: { id: idComment },
    });
    const _commentUpdate = { ..._comments[0] };
    _commentUpdate.message = message;

    return !!(await this.commentsRepository.save({
      ..._comments,
      ..._commentUpdate,
    }));
  }
}
