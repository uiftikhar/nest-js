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
  let commentRepository: Repository<CommentEntity>;
  let userRepository: Repository<UserEntity>;
  let ideaRepository: Repository<IdeaEntity>;

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
    expect(controller).toBeDefined();
  });

  describe('showCommentsByIdea', () => {
    it('should show all comments by Idea Id', async done => {
      const result: CommentResponseDto[] = [
        {
          id: '6fedac2f-ec25-433f-97c8-7efa41618733',
          created: new Date(Date.now()),
          comment: `Placeat aut et consequatur. Id deserunt similique minima eos 
            quia nemo eum ipsam. Officiis sit praesentium tempora voluptatum 
            aperiam pariatur. Consequatur quae mollitia a eum aut.`,
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
            description: `Aliquid veniam laudantium qui ad. Eos neque at voluptatem 
              neque quibusdam qui. Ea corrupti quod occaecati vitae sit.`,
            upvotes: 0,
            downvotes: 0,
          },
        },
      ];

      jest
        .spyOn(commentService, 'showByIdeaId')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await controller.showCommentsByIdea(
          'a4f99d92-72f2-460c-a14d-dda2c6298b58',
          1
        )
      ).toBe(result);
      done();
    });
  });

  describe('showCommentsByUser', () => {
    it('should show all comments by User Id', async done => {
      const result: CommentResponseDto[] = [
        {
          id: '22e3d316-b119-428a-bbf1-e5e0a56cccd1',
          created: new Date(Date.now()),
          comment: `Repellendus sunt ipsum laudantium atque. Sed ut quis repellendus itaque 
            alias ex. Error eaque iusto nesciunt praesentium expedita iure fuga expedita.`,
          author: {
            id: '4cd70811-bd7a-47c7-aad3-cf2129399a91',
            created: new Date(Date.now()),
            username: 'Nola2',
          },
          idea: {
            id: '4a3747e6-61ba-4c72-aa3f-ceddb2cc22b0',
            created: new Date(Date.now()),
            updated: new Date(Date.now()),
            idea: 'Instagram for magazine research',
            description: `Unde eos quos ab. Vitae necessitatibus porro vel praesentium
               quasi facilis repellat consequatur.Nisi et omnis consectetur. 
               Iure recusandae ut. Nostrum quod quaerat fuga temporibus
               voluptas placeat nulla qui.`,
            upvotes: 0,
            downvotes: 0,
          },
        },
      ];

      jest
        .spyOn(commentService, 'showByUserId')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await controller.showCommentsByUser(
          '4cd70811-bd7a-47c7-aad3-cf2129399a91',
          1
        )
      ).toBe(result);
      done();
    });
  });

  describe('showComment', () => {
    it('should show the comment by comment Id', async done => {
      const result: CommentResponseDto = {
        id: '21e6b1c6-c3a7-4825-8010-2ae7e2b38416',
        created: new Date(Date.now()),
        comment: `Asperiores vel reiciendis reiciendis. Culpa voluptatem voluptatem et
           voluptates nostrum distinctio. Et modi commodi reprehenderit magnam 
           illum itaque iusto quas qui. Sint doloribus dolor. Quod architecto 
           quidem aut aut sed est fugit tempora nobis. Qui quaerat ullam sed 
           quod ut culpa molestiae porro aut.`,
        author: {
          id: `4cd70811-bd7a-47c7-aad3-cf2129399a91`,
          created: new Date(Date.now()),
          username: `Nola2`,
        },
        idea: {
          id: `8648705f-4ec6-4984-b074-4808c41464ec`,
          created: new Date(Date.now()),
          updated: new Date(Date.now()),
          idea: `A project planner for online shopping`,
          description: `Necessitatibus nobis placeat sed hic et qui aut ratione id. 
            Commodi aliquid sed ut dolorem. Exercitationem eveniet excepturi 
            officia rerum in architecto molestias. Aspernatur dolores
             repudiandae facere consequuntur itaque aut eaque quod qui. 
             Quidem voluptas pariatur.`,
          upvotes: 0,
          downvotes: 0,
        },
      };

      jest
        .spyOn(commentService, 'show')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await controller.showComment(
          '21e6b1c6-c3a7-4825-8010-2ae7e2b38416'
        )
      ).toBe(result);
      done();
    });
  });

  describe('destroyComment', () => {
    it('should destroyComment comments by comment Id', async done => {
      const result: {
        comment: CommentResponseDto;
        deleted: boolean;
      } = {
        comment: {
          id: '21e6b1c6-c3a7-4825-8010-2ae7e2b38416',
          created: new Date(Date.now()),
          comment: `Asperiores vel reiciendis reiciendis. Culpa voluptatem voluptatem et
           voluptates nostrum distinctio. Et modi commodi reprehenderit magnam 
           illum itaque iusto quas qui. Sint doloribus dolor. Quod architecto 
           quidem aut aut sed est fugit tempora nobis. Qui quaerat ullam sed 
           quod ut culpa molestiae porro aut.`,
          author: {
            id: `4cd70811-bd7a-47c7-aad3-cf2129399a91`,
            created: new Date(Date.now()),
            username: `Nola2`,
          },
          idea: {
            id: `8648705f-4ec6-4984-b074-4808c41464ec`,
            created: new Date(Date.now()),
            updated: new Date(Date.now()),
            idea: `A project planner for online shopping`,
            description: `Necessitatibus nobis placeat sed hic et qui aut ratione id. 
            Commodi aliquid sed ut dolorem. Exercitationem eveniet excepturi 
            officia rerum in architecto molestias. Aspernatur dolores
             repudiandae facere consequuntur itaque aut eaque quod qui. 
             Quidem voluptas pariatur.`,
            upvotes: 0,
            downvotes: 0,
          },
        },
        deleted: true,
      };

      jest
        .spyOn(commentService, 'destroy')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await controller.destroyComment(
          '21e6b1c6-c3a7-4825-8010-2ae7e2b38416',
          '4cd70811-bd7a-47c7-aad3-cf2129399a91'
        )
      ).toBe(result);
      done();
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async done => {
      const result: CommentResponseDto = {
        comment: 'Test comment',
        author: {
          id: 'f5342705-2e27-480d-90a1-42e6a0de3ac7',
          created: new Date(Date.now()),
          username: 'Nola2',
        },
        idea: {
          id: 'f5342705-2e27-480d-90a1-42e6a0de3ac7',
          created: new Date(Date.now()),
          updated: new Date(Date.now()),
          idea: 'Pinterest for teachers',
          description:
            'Rerum atque ut rerum. Earum nemo vel aperiam ut. Magni quam ipsam excepturi iste.',
          upvotes: 0,
          downvotes: 0,
        },
        id: 'abeed113-4a88-4ff1-98c1-dd686195d19c',
        created: new Date(Date.now()),
      };

      jest
        .spyOn(commentService, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await controller.createComment(
          'f5342705-2e27-480d-90a1-42e6a0de3ac7',
          'f5342705-2e27-480d-90a1-42e6a0de3ac7',
          {
            comment: 'Test comment',
          }
        )
      ).toBe(result);
      done();
    });
  });
});
