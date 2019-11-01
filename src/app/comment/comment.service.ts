import { InjectRepository } from '@nestjs/typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';
import { CommentDto } from './comment.dto';
import { CommentResponseDto } from './comment.response.dto';
import { MAX_OPTIONS_PER_PAGE } from '../shared/constants/MAX_OPTIONS_PER_PAGE';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>
  ) {}

  private toResponseObject(
    comment: CommentEntity
  ): CommentResponseDto {
    return {
      ...comment,
      author: comment.author
        ? comment.author.toResponseObject()
        : null,
      idea: comment.idea.toResponseObject(comment.idea),
    };
  }

  async showByIdeaId(
    id: string,
    page: number = 1
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository
      .find({
        where: { idea: { id } },
        relations: ['author'],
        take: MAX_OPTIONS_PER_PAGE,
        skip: MAX_OPTIONS_PER_PAGE * (page - 1),
      })
      .catch(() => {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND
        );
      });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUserId(
    id: string,
    page: number = 1
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository
      .find({
        where: { author: { id } },
        relations: ['author'],
        take: MAX_OPTIONS_PER_PAGE,
        skip: MAX_OPTIONS_PER_PAGE * (page - 1),
      })
      .catch(() => {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND
        );
      });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository
      .findOneOrFail({ where: { id }, relations: ['author', 'idea'] })
      .catch(() => {
        throw new HttpException(
          'comment not found',
          HttpStatus.NOT_FOUND
        );
      });

    return this.toResponseObject(comment);
  }

  async create(
    ideaId: string,
    userId: string,
    data: CommentDto
  ): Promise<CommentResponseDto> {
    const idea = await this.ideaRepository
      .findOneOrFail({ where: { id: ideaId } })
      .catch(() => {
        throw new HttpException(
          'no idea found',
          HttpStatus.NOT_FOUND
        );
      });

    const user = await this.userRepository
      .findOneOrFail({ where: { id: userId } })
      .catch(() => {
        throw new HttpException(
          'no user found',
          HttpStatus.FORBIDDEN
        );
      });

    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    });

    await this.commentRepository.save(comment).catch(() => {
      throw new HttpException(
        'error saving comment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });

    return this.toResponseObject(comment);
  }

  async destroy(
    id: string,
    userId: string
  ): Promise<{
    comment: CommentResponseDto;
    deleted: boolean;
  }> {
    const comment = await this.commentRepository
      .findOneOrFail({
        where: { id },
        relations: ['author', 'idea'],
      })
      .catch(() => {
        throw new HttpException(
          'comment not found',
          HttpStatus.NOT_FOUND
        );
      });

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED
      );
    }

    this.commentRepository.remove(comment);
    return { comment: this.toResponseObject(comment), deleted: true };
  }
}
