import { Test, TestingModule } from '@nestjs/testing';
import { TutorialsService } from './tutorial.service';
import { TutorialRepository } from '../repositories/tutorial.repository';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';

describe('TutorialsService', () => {
  let service: TutorialsService;
  let tutorialRepository: TutorialRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialsService,
        {
          provide: TutorialRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByTitle: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TutorialsService>(TutorialsService);
    tutorialRepository = module.get<TutorialRepository>(TutorialRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tutorial', async () => {
    const createTutorialDto: CreateTutorialDto = {
      title: 'Test Tutorial',
      content: 'This is a test tutorial',
      userId: 'user1',
    };

    (tutorialRepository.findByTitle as jest.Mock).mockResolvedValue(null);
    (tutorialRepository.create as jest.Mock).mockResolvedValue({
      id: '1',
      ...createTutorialDto,
    });

    const result = await service.create(createTutorialDto);

    expect(result).toEqual({ id: '1', ...createTutorialDto });
    expect(tutorialRepository.findByTitle).toHaveBeenCalledWith(
      'Test Tutorial',
    );
    expect(tutorialRepository.create).toHaveBeenCalledWith(createTutorialDto);
  });

  it('should throw an error if tutorial with the same title exists', async () => {
    const createTutorialDto: CreateTutorialDto = {
      title: 'Test Tutorial',
      content: 'This is a test tutorial',
      userId: 'user1',
    };

    (tutorialRepository.findByTitle as jest.Mock).mockResolvedValue(
      createTutorialDto,
    );

    await expect(service.create(createTutorialDto)).rejects.toThrow(
      'Um tutorial com esse título já existe',
    );
  });

  it('should find all tutorials with filters', async () => {
    const filter: FilterTutorialDto = { title: 'Test' };
    const tutorials = [
      { id: '1', title: 'Test', content: 'This is a test', userId: 'user1' },
    ];

    (tutorialRepository.findAll as jest.Mock).mockResolvedValue(tutorials);

    const result = await service.findAll(filter);

    expect(result).toEqual(tutorials);
    expect(tutorialRepository.findAll).toHaveBeenCalledWith(filter);
  });

  it('should find a tutorial by id', async () => {
    const tutorial = {
      id: '1',
      title: 'Test',
      content: 'This is a test',
      userId: 'user1',
    };

    (tutorialRepository.findById as jest.Mock).mockResolvedValue(tutorial);

    const result = await service.findOne('1');

    expect(result).toEqual(tutorial);
    expect(tutorialRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should update a tutorial', async () => {
    const updateTutorialDto: UpdateTutorialDto = {
      title: 'Updated Test',
      content: 'Updated content',
    };
    const tutorial = {
      id: '1',
      title: 'Test',
      content: 'This is a test',
      userId: 'user1',
    };

    (tutorialRepository.findById as jest.Mock).mockResolvedValue(tutorial);
    (tutorialRepository.findByTitle as jest.Mock).mockResolvedValue(null);
    (tutorialRepository.update as jest.Mock).mockResolvedValue({
      ...tutorial,
      ...updateTutorialDto,
    });

    const result = await service.update('1', updateTutorialDto);

    expect(result).toEqual({ ...tutorial, ...updateTutorialDto });
    expect(tutorialRepository.findById).toHaveBeenCalledWith('1');
    expect(tutorialRepository.findByTitle).toHaveBeenCalledWith('Updated Test');
    expect(tutorialRepository.update).toHaveBeenCalledWith(
      '1',
      updateTutorialDto,
    );
  });

  it('should throw an error if tutorial with the same updated title exists', async () => {
    const updateTutorialDto: UpdateTutorialDto = {
      title: 'Existing Title',
      content: 'Updated content',
    };
    const tutorial = {
      id: '1',
      title: 'Test',
      content: 'This is a test',
      userId: 'user1',
    };

    (tutorialRepository.findById as jest.Mock).mockResolvedValue(tutorial);
    (tutorialRepository.findByTitle as jest.Mock).mockResolvedValue(
      updateTutorialDto,
    );

    await expect(service.update('1', updateTutorialDto)).rejects.toThrow(
      'Um tutorial com esse título já existe',
    );
  });

  it('should remove a tutorial', async () => {
    (tutorialRepository.remove as jest.Mock).mockResolvedValue({ id: '1' });

    const result = await service.remove('1');

    expect(result).toEqual({ id: '1' });
    expect(tutorialRepository.remove).toHaveBeenCalledWith('1');
  });
});
