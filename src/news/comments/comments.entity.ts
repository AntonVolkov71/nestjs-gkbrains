import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';
import { IsNumber } from 'class-validator';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => UsersEntity, (user) => user.comments)
  user: UsersEntity;

  @ManyToOne(() => NewsEntity, (news) => news.comments)
  // @IsNumber()
  news: NewsEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
