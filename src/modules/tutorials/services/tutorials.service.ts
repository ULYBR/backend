import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';

@Injectable()
export class TutorialsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTutorialDto: CreateTutorialDto) {
    const existingTutorial = await this.prisma.tutorial.findUnique({
      where: { title: createTutorialDto.title },
    });

    if (existingTutorial) {
      throw new Error('Um tutorial com esse título já existe');
    }

    return this.prisma.tutorial.create({
      data: {
        title: createTutorialDto.title,
        content: createTutorialDto.content,
        user: {
          connect: { id: createTutorialDto.userId },
        },
      },
    });
  }

  async findAll(filter: FilterTutorialDto) {
    const where: any = {};

    if (filter.title) {
      where.title = {
        contains: filter.title,
        mode: 'insensitive', // Torna a pesquisa case-insensitive
      };
    }

    if (filter.startDate && filter.endDate) {
      where.OR = [
        {
          createdAt: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
        },
        {
          updatedAt: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
        },
      ];
    }

    return this.prisma.tutorial.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: filter.skip || 0,
      take: filter.take || 10,
    });
  }

  async findOne(id: string) {
    return this.prisma.tutorial.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTutorialDto: UpdateTutorialDto) {
    const tutorial = await this.prisma.tutorial.findUnique({
      where: { id },
    });

    if (!tutorial) {
      throw new Error(`Tutorial com id ${id} não encontrado`);
    }

    if (updateTutorialDto.title && updateTutorialDto.title !== tutorial.title) {
      const existingTutorial = await this.prisma.tutorial.findUnique({
        where: { title: updateTutorialDto.title },
      });

      if (existingTutorial) {
        throw new Error('Um tutorial com esse título já existe');
      }
    }

    return this.prisma.tutorial.update({
      where: { id },
      data: {
        ...updateTutorialDto,
        user: {
          connect: { id: updateTutorialDto.userId },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.tutorial.delete({
      where: { id },
    });
  }
}
