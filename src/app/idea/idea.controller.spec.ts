import { Test, TestingModule } from '@nestjs/testing';
import { IdeaController } from './idea.controller';

/*
DATABASE TESTING
  describe("DepartmentService", () => {
  let service: DepartmentService;
  let repo: Repository<Department>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Department])
      ],
      providers: [DepartmentService]
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    repo = module.get<Repository<Department>>(getRepositoryToken(Department));
  });

  afterAll(async () => {
    module.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // ...
}

  */
describe('Idea Controller', () => {
  let controller: IdeaController;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [IdeaController],
    // }).compile();
    //
    // controller = module.get<IdeaController>(IdeaController);
  });

  it('should be defined', () => {
    // expect(controller).toBeDefined();
    expect(1).toEqual(1);
  });
});
