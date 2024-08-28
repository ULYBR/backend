import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';

@Injectable()
export class TutorialsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createTutorialDto: CreateTutorialDto) {
    return this.prisma.tutorial.create({
      data: createTutorialDto,
    });
  }

  async findAll(filterDto: FilterTutorialDto) {
    const { title, createdAfter, updatedAfter, page, limit } = filterDto;

    const cacheKey = `tutorials_${JSON.stringify(filterDto)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const where = {
      ...(title && { title: { contains: title } }),
      ...(createdAfter && { createdAt: { gte: new Date(createdAfter) } }),
      ...(updatedAfter && { updatedAt: { gte: new Date(updatedAfter) } }),
    };

    const tutorials = await this.prisma.tutorial.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    await this.cacheManager.set(cacheKey, tutorials, 60000);

    return tutorials;
  }

  async findOne(id: string) {
    return this.prisma.tutorial.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTutorialDto: UpdateTutorialDto) {
    return this.prisma.tutorial.update({
      where: { id },
      data: updateTutorialDto,
    });
  }

  async remove(id: string) {
    return this.prisma.tutorial.delete({
      where: { id },
    });
  }
}
