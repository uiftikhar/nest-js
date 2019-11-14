import { CommentEntity } from '../comment.entity';
import { UserEntity } from '../../user/user.entity';

const commentEntityMockResponse: CommentEntity[] = [
  {
    id: 'ae563ab0-dfd4-4811-b10e-69ca0477070d',
    created: new Date(Date.now()),
    comment: 'test comment 1',
    author: {
      id: '5f098a64-81c5-462a-9633-2327091c1fb6',
      created: new Date(Date.now()),
      username: 'Jeanette_Batz95',
      password:
        '$2a$10$/nnTladXXM8hQtKI1jtC0OHYGnXdI.8ljzjI5DRr8Me1AXLRWOLES',
    },
    idea: {
      id: '006f9ef6-68f5-44e5-9e03-02ea51aee58b',
      idea: 'Yelp for sharing content',
      description:
        'Nisi sequi et a asperiores velit dolores libero autem aut. Qui est iure enim numquam neque architecto magnam. Voluptatem eius sit illo recusandae odit eum. Omnis sed sed accusamus dolor commodi dolorem repellendus quaerat velit. Laborum nostrum velit eius sunt. Ea rerum nihil incidunt saepe rem nemo ut.',
      created: new Date(Date.now()),
      updated: new Date(Date.now()),
    },
  },
  {
    id: 'fefbd76b-b758-476a-a7a6-5ebd8c012445',
    created: new Date(Date.now()),
    comment: 'test comment 4',
    author: {
      id: '5f098a64-81c5-462a-9633-2327091c1fb6',
      created: new Date(Date.now()),
      username: 'Jeanette_Batz95',
      password:
        '$2a$10$/nnTladXXM8hQtKI1jtC0OHYGnXdI.8ljzjI5DRr8Me1AXLRWOLES',
    },
    idea: {
      id: '006f9ef6-68f5-44e5-9e03-02ea51aee58b',
      idea: 'Yelp for sharing content',
      description:
        'Nisi sequi et a asperiores velit dolores libero autem aut. Qui est iure enim numquam neque architecto magnam. Voluptatem eius sit illo recusandae odit eum. Omnis sed sed accusamus dolor commodi dolorem repellendus quaerat velit. Laborum nostrum velit eius sunt. Ea rerum nihil incidunt saepe rem nemo ut.',
      created: new Date(Date.now()),
      updated: new Date(Date.now()),
    },
  },
];
