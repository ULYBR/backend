import { Injectable } from '@nestjs/common';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';
import { TutorialRepository } from '../repositories/tutorial.repository';

@Injectable()
export class TutorialsService {
  constructor(private readonly tutorialRepository: TutorialRepository) {}

  async create(createTutorialDto: CreateTutorialDto) {
    const existingTutorial = await this.tutorialRepository.findByTitle(
      createTutorialDto.title,
    );

    if (existingTutorial) {
      throw new Error('Um tutorial com esse título já existe');
    }

    return this.tutorialRepository.create(createTutorialDto);
  }

  async findAll(filter: FilterTutorialDto) {
    return this.tutorialRepository.findAll(filter);
  }

  async findOne(id: string) {
    return this.tutorialRepository.findById(id);
  }

  async update(id: string, updateTutorialDto: UpdateTutorialDto) {
    const tutorial = await this.tutorialRepository.findById(id);

    if (!tutorial) {
      throw new Error(`Tutorial com id ${id} não encontrado`);
    }

    if (updateTutorialDto.title && updateTutorialDto.title !== tutorial.title) {
      const existingTutorial = await this.tutorialRepository.findByTitle(
        updateTutorialDto.title,
      );

      if (existingTutorial) {
        throw new Error('Um tutorial com esse título já existe');
      }
    }

    return this.tutorialRepository.update(id, updateTutorialDto);
  }

  async remove(id: string) {
    return this.tutorialRepository.remove(id);
  }
}
