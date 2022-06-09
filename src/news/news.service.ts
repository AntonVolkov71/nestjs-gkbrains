import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async findAll(): Promise<NewsEntity[]> {
    return await this.newsRepository.find({
      relations: ['user', 'category', 'comments'],
    });
  }

  async findByIndex(id: number): Promise<NewsEntity> {
    return await this.newsRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'comments'],
    });
  }
  u;
  async update(id: number, news: NewsEntity) {
    const _news = await this.findByIndex(id);
    return await this.newsRepository.save({
      ..._news,
      ...news,
    });
  }

  async remove(id: number) {
    const _news = await this.findByIndex(id);
    return await this.newsRepository.remove(_news);
  }
}
