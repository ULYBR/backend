import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  CreateUserSchema,
  LoginUserSchema,
} from '../../../validation/user.validation';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const parsedData = CreateUserSchema.safeParse(createUserDto);
    if (!parsedData.success) {
      throw new BadRequestException(parsedData.error.errors);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
      },
    });
  }

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    const parsedData = LoginUserSchema.safeParse(loginUserDto);
    if (!parsedData.success) {
      throw new BadRequestException(parsedData.error.errors);
    }

    const user = await this.prisma.user.findUnique({
      where: { username: loginUserDto.username },
    });

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      return !!payload;
    } catch (error) {
      return false;
    }
  }
}
