import { IdeaEntity } from '../idea/idea.entity';

export class UserResponseDto {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}
