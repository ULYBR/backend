import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            findUserByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = { username: 'test', password: 'password' };
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    (userRepository.createUser as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'test',
      password: hashedPassword,
    });

    const result = await service.createUser(createUserDto);

    expect(result).toEqual({
      id: '1',
      username: 'test',
      password: hashedPassword,
    });
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.any(String),
    });
  });

  it('should return a token on successful login', async () => {
    const loginUserDto = { username: 'test', password: 'password' };
    const hashedPassword = await bcrypt.hash(loginUserDto.password, 10);

    (userRepository.findUserByUsername as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'test',
      password: hashedPassword,
    });
    (jwtService.sign as jest.Mock).mockReturnValue('token');

    const result = await service.loginUser(loginUserDto);

    expect(result).toEqual({ access_token: 'token' });
    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'test', sub: '1' }),
    );
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    const loginUserDto = { username: 'wrongUser', password: 'wrongPassword' };
    (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);

    await expect(service.loginUser(loginUserDto)).rejects.toThrow(
      new UnauthorizedException('Credenciais inválidas'),
    );
  });
});
