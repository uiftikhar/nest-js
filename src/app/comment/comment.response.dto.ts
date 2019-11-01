import { IdeaEntity } from '../idea/idea.entity';
import { UserResponseDto } from '../user/user-response.dto';
import { IdeaResponseDto } from '../idea/idea-response.dto';

export class CommentResponseDto {
  author: UserResponseDto;
  id: string;
  created: Date;
  comment: string;
  idea: IdeaResponseDto;
}
