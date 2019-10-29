import { IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  comment: string;
}
