import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';

@Injectable()
export class TutorialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTutorialDto: CreateTutorialDto) {
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

  async findByTitle(title: string) {
    return this.prisma.tutorial.findUnique({
      where: { title },
    });
  }

  async findAll(filter: FilterTutorialDto) {
    const where: any = {};

    if (filter.title) {
      where.title = {
        contains: filter.title,
        mode: 'insensitive',
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

  async findById(id: string) {
    return this.prisma.tutorial.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTutorialDto: UpdateTutorialDto) {
    return this.prisma.tutorial.update({
      where: { id },
      data: {
        ...updateTutorialDto,
        userId: updateTutorialDto.userId,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.tutorial.delete({
      where: { id },
    });
  }
}
