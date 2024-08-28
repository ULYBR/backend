import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
