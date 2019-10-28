import { UserResponseDto } from '../user/user-response.dto';
import { UserEntity } from '../user/user.entity';

export class IdeaResponseDto {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserResponseDto;
  upvotes?: number;
  downvotes?: number;
}
