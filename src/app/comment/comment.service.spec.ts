import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<CommentEntity>;
  let userRepository: Repository<UserEntity>;
  let ideaRepository: Repository<IdeaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useFactory: () => ({
            find: jest.fn(() => true),
            findOneOrFail: jest.fn(() => true),
            create: jest.fn(() => true),
            save: jest.fn(() => true),
            remove: jest.fn(() => true),
          }),
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({
            findOneOrFail: jest.fn(() => true),
          }),
        },
        {
          provide: getRepositoryToken(IdeaEntity),
          useFactory: () => ({
            findOneOrFail: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity)
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
    ideaRepository = module.get<Repository<IdeaEntity>>(
      getRepositoryToken(IdeaEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('showByIdeaId', () => {
  //     it('should show comment by Idea ID')
  // })
});
