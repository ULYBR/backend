import { Module } from '@nestjs/common';
import { TutorialsService } from './services/tutorials.service';
import { TutorialsController } from './controllers/tutorials.controller';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [TutorialsController],
  providers: [TutorialsService, PrismaService],
})
export class TutorialsModule {}
