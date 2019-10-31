import { IdeaEntity } from '../idea/idea.entity';
import { IdeaResponseDto } from '../idea/idea-response.dto';

export class UserResponseDto {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: IdeaResponseDto[];
  bookmarks?: IdeaResponseDto[];
}
