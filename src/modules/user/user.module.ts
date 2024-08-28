import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { UserController } from '../user/controllers/user.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  providers: [UserService, PrismaService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
