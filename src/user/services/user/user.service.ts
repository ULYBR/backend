import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
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

    await this.cacheManager.set(token, payload, 3600);

    return { access_token: token };
  }

  async validateToken(token: string): Promise<boolean> {
    const cachedToken = await this.cacheManager.get(token);
    return !!cachedToken;
  }
}
