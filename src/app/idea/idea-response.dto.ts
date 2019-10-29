import { UserResponseDto } from '../user/user-response.dto';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

export class IdeaResponseDto {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserResponseDto | UserEntity;
  // TODO remove userEntity array?
  upvotes?: number | UserEntity[];
  downvotes?: number | UserEntity[];
  comments?: string | CommentEntity[];
}
