import { Module } from '@nestjs/common';
import { TutorialsService } from './services/tutorials.service';
import { TutorialsController } from './controllers/tutorials.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  imports: [CacheModule],
  controllers: [TutorialsController],
  providers: [TutorialsService, PrismaService],
})
export class TutorialsModule {}
