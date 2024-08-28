import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { TutorialsModule } from './modules/tutorials/tutorial.module';
import { PrismaService } from './database/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TutorialsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
