import { IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  comments: string;
}
