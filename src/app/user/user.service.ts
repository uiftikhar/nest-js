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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async showAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
    });
    return users.map(user => user.toResponseObject(false));
  }

  async login(data: UserDto): Promise<UserResponseDto> {
    let user: UserEntity;
    let comparePass: boolean;
    const { password, username } = data;
    try {
      user = await this.userRepository.findOne({
        where: { username },
      });
      comparePass = await user.comparePassword(password);
      if (!comparePass) {
        throw new HttpException(
          'Invalid username/password',
          HttpStatus.BAD_REQUEST
        );
      }
      return user.toResponseObject();
    } catch (e) {
      if (!user) {
        throw new HttpException(
          'Invalid username/password',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  async register(data: UserDto): Promise<UserResponseDto> {
    let isExistingUser: UserEntity;
    let newUser: UserEntity;
    try {
      const { username } = data;
      isExistingUser = await this.userRepository.findOne({
        where: { username },
      });
      newUser = await this.userRepository.create(data);
      newUser = await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      if (isExistingUser) {
        throw new HttpException(
          'User already exists',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!newUser) {
        throw new HttpException(
          'Bad Request: Error creating user',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }
}
