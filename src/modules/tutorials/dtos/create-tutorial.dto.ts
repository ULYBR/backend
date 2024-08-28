import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorialDto {
  @ApiProperty({
    description: 'The title of the tutorial',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the tutorial',
    example: 'This is a basic tutorial on how to use NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The author of the tutorial',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: 'The ID of the user creating the tutorial',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
