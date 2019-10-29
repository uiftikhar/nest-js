import { UserResponseDto } from '../user/user-response.dto';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

export class IdeaResponseDto {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserResponseDto;
  upvotes?: number;
  downvotes?: number;
  comments?: string | CommentEntity[];
}
