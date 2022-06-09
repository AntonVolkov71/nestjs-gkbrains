import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { hash } from '../utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.roles = user.roles;

    userEntity.password = await hash(user.password);

    return this.usersRepository.save(userEntity);
  }

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, user): Promise<UsersEntity> {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.roles = user.role;

    const _user = await this.findOne(id);
    return await this.usersRepository.save({
      ..._user,
      ...userEntity,
    });
  }

  async remove(id: number) {
    const _user = await this.findOne(id);
    return await this.usersRepository.remove(_user);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }
}
