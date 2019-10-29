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
        ? comment.author.toResponseObject(false)
        : null,
    };
  }

  async showByIdeaId(id: string): Promise<CommentResponseDto[]> {
    const idea = await this.ideaRepository
      .findOne({
        where: { id },
        relations: ['comments', 'comments.author', 'comments.idea'],
      })
      .catch(() => {
        throw new HttpException(
          'Idea not found',
          HttpStatus.NOT_FOUND
        );
      });
    return idea.comments.map(comment =>
      this.toResponseObject(comment)
    );
  }

  async showByUserId(id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository
      .findOne({ where: { id }, relations: ['author', 'idea'] })
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
      .findOne({ where: { id: ideaId } })
      .catch(() => {
        throw new HttpException(
          'no idea found',
          HttpStatus.NOT_FOUND
        );
      });

    const user = await this.userRepository
      .findOne({ where: { id: userId } })
      .catch(() => {
        throw new HttpException(
          'no user found',
          HttpStatus.FORBIDDEN
        );
      });

    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user.toResponseObject(false),
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
      .findOne({
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
