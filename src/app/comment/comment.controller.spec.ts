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
    it('should show all comments by Idea Id', async done => {
      const result: CommentResponseDto[] = [
        {
          id: '6fedac2f-ec25-433f-97c8-7efa41618733',
          created: new Date(Date.now()),
          comment:
            'Placeat aut et consequatur. Id deserunt similique minima eos quia nemo eum ipsam. Officiis sit praesentium tempora voluptatum aperiam pariatur. Consequatur quae mollitia a eum aut.',
          author: {
            id: '8abf1263-a32e-4c53-ad0b-bfbeaf332da0',
            created: new Date(Date.now()),
            username: 'Gladys71',
          },
          idea: {
            id: 'a4f99d92-72f2-460c-a14d-dda2c6298b58',
            created: new Date(Date.now()),
            updated: new Date(Date.now()),
            idea: 'Instagram for attending meetups',
            description:
              'Aliquid veniam laudantium qui ad. Eos neque at voluptatem neque quibusdam qui. Ea corrupti quod occaecati vitae sit.',
            upvotes: 0,
            downvotes: 0,
          },
        },
      ];

      jest
        .spyOn(commentService, 'showByIdeaId')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.showCommentsByIdea('id', 2)).toBe(
        result
      );
      done();
    });
  });
});
