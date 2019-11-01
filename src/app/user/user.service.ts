import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { UserResponseDto } from './user-response.dto';
import { MAX_OPTIONS_PER_PAGE } from '../shared/constants/MAX_OPTIONS_PER_PAGE';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async showAll(page: number = 1): Promise<UserResponseDto[]> {
    const users = await this.userRepository
      .find({
        relations: ['ideas', 'bookmarks'],
        take: MAX_OPTIONS_PER_PAGE,
        skip: MAX_OPTIONS_PER_PAGE * (page - 1),
      })
      .catch(() => {
        throw new HttpException(
          'Users Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    return users.map(user => user.toResponseObject(false));
  }

  async login(data: UserDto): Promise<UserResponseDto> {
    const { password, username } = data;
    const user = await this.userRepository
      .findOneOrFail({
        where: { username },
      })
      .catch(() => {
        throw new HttpException(
          'User Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    await user.comparePassword(password).catch(() => {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST
      );
    });
    return user.toResponseObject(true);
  }

  async register(data: UserDto): Promise<UserResponseDto> {
    let newUser: UserEntity;
    const { username } = data;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST
      );
    }

    newUser = await this.userRepository.create(data);
    newUser = await this.userRepository.save(newUser).catch(() => {
      throw new HttpException(
        'Bad Request: Error creating user',
        HttpStatus.BAD_REQUEST
      );
    });
    return newUser.toResponseObject(true);
  }
}
