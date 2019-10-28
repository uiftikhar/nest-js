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

  async showById(id: string) {
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
    return idea.comments;
  }

  async showByUser(id: string) {
    const comments = this.commentRepository.find({
      where: { author: { id } },
    });

    return comments;
  }

  async show(id: string) {
    const comment = await this.commentRepository
      .findOne({ where: { id }, relations: ['author', 'idea'] })
      .catch(() => {
        throw new HttpException(
          'comment not found',
          HttpStatus.NOT_FOUND
        );
      });

    return comment;
  }

  async create(ideaId: string, userId: string, data: CommentDto) {
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
      author: user,
    });

    Logger.log(
      `LOLOLOLOLOLOLOOLOL12${idea}, ${user}, ${data.comments}`
    );

    // await this.commentRepository.save(comment).catch(() => {
    //   throw new HttpException(
    //     'error saving comment',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // });

    return comment;
  }

  async destroy(id: string, userId: string) {
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
    return { ...comment, deleted: true };
  }
}
