import { UserResponseDto } from '../user/user-response.dto';

export class IdeaResponseDto {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author?: UserResponseDto;
  upvotes?: number;
  downvotes?: number;
  comments?: string[];
}
