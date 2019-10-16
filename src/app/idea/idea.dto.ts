import { IsString } from 'class-validator';

export class IdeaDto {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}
