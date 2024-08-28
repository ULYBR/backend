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
import { TutorialsService } from '../services/tutorial.service';
import { CreateTutorialDto } from '../dtos/create-tutorial.dto';
import { FilterTutorialDto } from '../dtos/filter-tutorial.dto';
import { UpdateTutorialDto } from '../dtos/update-tutorial.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('tutorials')
@Controller('tutorial')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tutorial' })
  @ApiResponse({ status: 201, description: 'Tutorial created successfully.' })
  @ApiBody({ type: CreateTutorialDto })
  create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tutorials' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date',
  })
  @ApiResponse({ status: 200, description: 'List of tutorials' }) // Expected response
  findAll(@Query() filterDto: FilterTutorialDto) {
    return this.tutorialsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tutorial by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the tutorial' })
  @ApiResponse({ status: 200, description: 'Details of the tutorial' })
  findOne(@Param('id') id: string) {
    return this.tutorialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tutorial' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the tutorial' })
  @ApiBody({
    type: UpdateTutorialDto,
    examples: {
      example: {
        summary: 'Example of updating a tutorial',
        value: {
          title: 'Updated Tutorial Title',
          content: 'This is the updated content of the tutorial.',
          author: 'Updated Author',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tutorial updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
  ) {
    return this.tutorialsService.update(id, updateTutorialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tutorial' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the tutorial' })
  @ApiResponse({ status: 200, description: 'Tutorial deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tutorialsService.remove(id);
  }
}
