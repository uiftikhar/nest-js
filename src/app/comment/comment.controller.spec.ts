import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';
import { CommentResponseDto } from './comment.response.dto';

describe('Comment Controller', () => {
  let controller: CommentController;
  let commentService: CommentService;
  let commentRepo: Repository<CommentEntity>;
  let userRepo: Repository<UserEntity>;
  let ideaRepo: Repository<IdeaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(IdeaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);

    commentService = module.get<CommentService>(CommentService);

    commentRepo = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity)
    );
    userRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
    ideaRepo = module.get<Repository<IdeaEntity>>(
      getRepositoryToken(IdeaEntity)
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('showCommentsByIdea', () => {
    it('should show all comments by Idea Id', async () => {
      const result: Partial<CommentResponseDto[]> = [
        {
          comment: 'Shyann.Schmitt',
          author: {
            id: 'e2bf1abc-bbb8-4e2c-8a97-2d514c564992',
            created: new Date(Date.now()),
            username: 'Shyann.Schmitt',
          },
          idea: {
            id: '32a9e308-abd9-4259-8b34-521e2a29ab13',
            idea: 'Periscope for truck drivers',
            description:
              'Autem id voluptas sed eum voluptas aperiam consequatur tempore. Dicta ad rerum nobis accusantium molestiae mollitia. Et qui praesentium eligendi aut suscipit.',
            created: new Date(Date.now()),
            updated: new Date(Date.now()),
          },
          id: '25cbcfdb-4e3c-4008-b356-3463127c7503',
          created: new Date(Date.now()),
        },
      ];
    });
  });
});
