import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';
import { CommentResponseDto } from './comment.response.dto';
import { MAX_OPTIONS_PER_PAGE } from '../shared/constants/MAX_OPTIONS_PER_PAGE';

describe('CommentService', () => {
  const sharedDate = new Date(Date.now());
  const commentEntityMock: Partial<CommentEntity[]> = [
    {
      id: 'ae563ab0-dfd4-4811-b10e-69ca0477070d',
      created: sharedDate,
      comment: 'test comment 1',
      author: {
        id: '5f098a64-81c5-462a-9633-2327091c1fb6',
        created: sharedDate,
        username: 'Jeanette_Batz95',
        toResponseObject: () => ({
          id: '5f098a64-81c5-462a-9633-2327091c1fb6',
          created: sharedDate,
          username: 'Jeanette_Batz95',
        }),
      },
      idea: {
        id: '006f9ef6-68f5-44e5-9e03-02ea51aee58b',
        idea: 'Yelp for sharing content',
        description:
          'Nisi sequi et a asperiores velit dolores libero autem aut. Qui est iure enim numquam neque architecto magnam. Voluptatem eius sit illo recusandae odit eum. Omnis sed sed accusamus dolor commodi dolorem repellendus quaerat velit. Laborum nostrum velit eius sunt. Ea rerum nihil incidunt saepe rem nemo ut.',
        created: sharedDate,
        updated: sharedDate,
        toResponseObject: () => ({
          id: '006f9ef6-68f5-44e5-9e03-02ea51aee58b',
          created: sharedDate,
          updated: sharedDate,
          idea: `Yelp for sharing content`,
          description: `Nisi sequi et a asperiores velit dolores libero autem aut.
               Qui est iure enim numquam neque architecto magnam. 
               Voluptatem eius sit illo recusandae odit eum. Omnis sed 
               sed accusamus dolor commodi dolorem repellendus quaerat
               velit. Laborum nostrum velit eius sunt. Ea rerum nihil
               incidunt saepe rem nemo ut.`,
          upvotes: 0,
          downvotes: 0,
        }),
      },
    },
  ];
  const commentResponse: CommentResponseDto[] = [
    {
      id: 'ae563ab0-dfd4-4811-b10e-69ca0477070d',
      created: sharedDate,
      comment: 'test comment 1',
      author: {
        id: '5f098a64-81c5-462a-9633-2327091c1fb6',
        created: sharedDate,
        username: 'Jeanette_Batz95',
      },
      idea: {
        id: '006f9ef6-68f5-44e5-9e03-02ea51aee58b',
        created: sharedDate,
        updated: sharedDate,
        idea: `Yelp for sharing content`,
        description: `Nisi sequi et a asperiores velit dolores libero autem aut.
               Qui est iure enim numquam neque architecto magnam. 
               Voluptatem eius sit illo recusandae odit eum. Omnis sed 
               sed accusamus dolor commodi dolorem repellendus quaerat
               velit. Laborum nostrum velit eius sunt. Ea rerum nihil
               incidunt saepe rem nemo ut.`,
        upvotes: 0,
        downvotes: 0,
      },
    },
  ];

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
            find: jest.fn(() => Promise.resolve(commentEntityMock)),
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

  describe('showByIdeaId', () => {
    it('should show comment by Idea ID', async done => {
      const mockId = '006f9ef6-68f5-44e5-9e03-02ea51aee58b';
      const page = 1;
      expect(await service.showByIdeaId(mockId, page)).toStrictEqual(
        commentResponse
      );

      expect(commentRepository.find).toBeCalledWith({
        where: { idea: { id: mockId } },
        relations: ['author', 'idea'],
        take: MAX_OPTIONS_PER_PAGE,
        skip: MAX_OPTIONS_PER_PAGE * (page - 1),
      });
      expect(await commentRepository.find()).toBe(commentEntityMock);
      done();
    });
  });

  describe('showByUserId', () => {
    it('should show comment by Idea ID', async done => {
      const mockId = '006f9ef6-68f5-44e5-9e03-02ea51aee58b';
      const page = 1;
      expect(await service.showByIdeaId(mockId, page)).toStrictEqual(
        commentResponse
      );

      expect(commentRepository.find).toBeCalledWith({
        where: { idea: { id: mockId } },
        relations: ['author', 'idea'],
        take: MAX_OPTIONS_PER_PAGE,
        skip: MAX_OPTIONS_PER_PAGE * (page - 1),
      });
      expect(await commentRepository.find()).toBe(commentEntityMock);
      done();
    });
  });
});
