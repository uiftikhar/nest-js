import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { IdeaDto } from './idea.dto';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaResponseDto } from './idea-response.dto';
import { Votes } from '../shared/enums/votes.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async showAll(): Promise<IdeaResponseDto[]> {
    let ideas: IdeaEntity[];
    try {
      ideas = await this.ideaRepository.find({
        relations: ['author', 'upvotes', 'downvotes'],
      });
      return ideas.map(idea => this.toResponseObject(idea));
    } catch (e) {
      if (!ideas) {
        throw new HttpException(
          'No Content found: ',
          HttpStatus.NO_CONTENT
        );
      }
    }
  }

  async create(
    userId: string,
    data: IdeaDto
  ): Promise<IdeaResponseDto> {
    let user: UserEntity;
    let idea: IdeaEntity;
    try {
      user = await this.userRepository.findOne({
        where: { id: userId },
      });
      idea = await this.ideaRepository.create({
        ...data,
        author: user,
      });
      await this.ideaRepository.save(idea);
      return this.toResponseObject(idea);
    } catch (e) {
      if (!user) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
    }
  }

  private toResponseObject(idea: IdeaEntity): IdeaResponseDto {
    return {
      ...idea,
      upvotes: idea.upvotes ? idea.upvotes.length : 0,
      downvotes: idea.downvotes ? idea.downvotes.length : 0,
      author: idea.author
        ? idea.author.toResponseObject(false)
        : null,
    };
  }

  async readIdea(id: string): Promise<IdeaResponseDto> {
    try {
      const idea = await this.ideaRepository.findOneOrFail({
        where: { id },
        relations: ['author', 'upvotes', 'downvotes'],
      });
      return this.toResponseObject(idea);
    } catch (exception) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    id: string,
    userId: string,
    data: Partial<IdeaDto>
  ): Promise<IdeaResponseDto> {
    let idea;
    let update;
    try {
      idea = await this.ideaRepository.findOne({
        where: { id },
        relations: ['author'],
      });
      this.ensureOwnership(idea, userId);
      update = await this.ideaRepository.update({ id }, data);
      return { ...idea, ...data };
    } catch (e) {
      if (!idea) {
        throw new HttpException(
          'Not Found: Could not find item to update',
          HttpStatus.NOT_FOUND
        );
      }
      if (!update) {
        throw new HttpException(
          'Error performing update',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  async destroy(id: string, userId: string) {
    let idea: IdeaEntity;
    try {
      idea = await this.ideaRepository.findOne({
        where: { id },
        relations: ['author'],
      });
      this.ensureOwnership(idea, userId);
      await this.ideaRepository.delete({ id });
      return {
        deleted: true,
        ...this.toResponseObject(idea),
      };
    } catch (e) {
      if (!idea) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    }
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException(
        'Incorrect User',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async bookmark(id: string, userId: string) {
    const idea = await this.ideaRepository
      .findOne({ where: { id } })
      .catch(() => {
        throw new HttpException(
          'Idea Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    const user = await this.userRepository
      .findOne({ where: { id: userId }, relations: ['bookmarks'] })
      .catch(() => {
        throw new HttpException(
          'User Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    if (!user.bookmarks.find(bookmark => bookmark.id === idea.id)) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user).catch(() => {
        throw new HttpException(
          'User Not Found',
          HttpStatus.NOT_FOUND
        );
      });
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_REQUEST
      );
    }

    return user.toResponseObject(false);
  }

  async removeBookmark(id: string, userId: string) {
    const idea = await this.ideaRepository
      .findOne({ where: { id } })
      .catch(() => {
        throw new HttpException(
          'Idea Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    const user = await this.userRepository
      .findOne({ where: { id: userId }, relations: ['bookmarks'] })
      .catch(() => {
        throw new HttpException(
          'User Not Found',
          HttpStatus.NOT_FOUND
        );
      });

    if (user.bookmarks.find(bookmark => bookmark.id === idea.id)) {
      user.bookmarks = user.bookmarks.filter(
        bmark => bmark.id !== idea.id
      );
      await this.userRepository.save(user).catch(() => {
        throw new HttpException(
          'User Not Found',
          HttpStatus.NOT_FOUND
        );
      });
    } else {
      throw new HttpException(
        'Idea Not bookmarked already',
        HttpStatus.BAD_REQUEST
      );
    }

    return user.toResponseObject(false);
  }

  async upvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    idea = await this._vote(idea, user, Votes.UP);
    return this.toResponseObject(idea);
  }

  async downvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    idea = await this._vote(idea, user, Votes.DOWN);
    return this.toResponseObject(idea);
  }

  private async _vote(
    idea: IdeaEntity,
    user: UserEntity,
    vote: Votes
  ) {
    const oppositeCurrentVote =
      vote === Votes.UP ? Votes.DOWN : Votes.UP;

    if (
      this.isIdeaAlreadyVoted(idea, user, vote) ||
      this.isVoteFromUser(idea, user, oppositeCurrentVote)
    ) {
      idea[oppositeCurrentVote] = idea[oppositeCurrentVote].filter(
        voter => voter.id !== user.id
      );
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);

      await this.ideaRepository.save(idea).catch(() => {
        throw new HttpException(
          'Unable to cast vote',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
    } else if (!this.isIdeaAlreadyVoted(idea, user, vote)) {
      idea[vote].push(user);

      await this.ideaRepository.save(idea).catch(() => {
        throw new HttpException(
          'Unable to cast vote',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
    } else {
      throw new HttpException(
        'Unable to cast vote',
        HttpStatus.BAD_REQUEST
      );
    }
    return idea;
  }

  private isVoteFromUser(
    idea: IdeaEntity,
    user: UserEntity,
    oppositeCurrentVote: Votes
  ) {
    return idea[oppositeCurrentVote].find(
      voter => voter.id === user.id
    );
  }

  private isIdeaAlreadyVoted(
    idea: IdeaEntity,
    user: UserEntity,
    vote: Votes
  ) {
    return idea[vote].find(voter => voter.id === user.id);
  }
}
