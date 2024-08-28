import { IsOptional, IsString, IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterTutorialDto {
  @ApiProperty({
    description: 'Filter by the title of the tutorial',
    example: 'Introduction to NestJS',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Filter by the start date of tutorial creation',
    example: '2024-08-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Filter by the end date of tutorial creation',
    example: '2024-08-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Number of records to skip for pagination',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({
    description: 'Number of records to take for pagination',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}
