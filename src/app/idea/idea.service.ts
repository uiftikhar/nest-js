import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { IdeaDto } from './idea.dto';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(data: IdeaDto) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async readIdea(id: string) {
    try {
      const idea = await this.ideaRepository.findOneOrFail({
        where: { id },
      });
      return idea;
    } catch (exception) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, data: Partial<IdeaDto>) {
    let idea;
    let update;
    try {
      idea = await this.ideaRepository.findOne({
        where: { id },
      });
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

  async destroy(id: string) {
    try {
      await this.ideaRepository.delete({ id });
      return {
        deleted: true,
      };
    } catch (e) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
