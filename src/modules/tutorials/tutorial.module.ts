import { Module } from '@nestjs/common';
import { TutorialsService } from './services/tutorial.service';
import { TutorialsController } from './controllers/tutorial.controller';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TutorialRepository } from './repositories/tutorial.repository';

@Module({
  controllers: [TutorialsController],
  providers: [TutorialsService, PrismaService, TutorialRepository],
})
export class TutorialsModule {}
