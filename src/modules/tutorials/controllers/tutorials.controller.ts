import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TutorialsService } from '../services/tutorials.service';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';

@Controller('tutorial')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post()
  create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterTutorialDto) {
    return this.tutorialsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
  ) {
    return this.tutorialsService.update(id, updateTutorialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorialsService.remove(id);
  }
}
