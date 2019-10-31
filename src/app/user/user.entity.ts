import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponseDto } from './user-response.dto';
import { IdeaEntity } from '../idea/idea.entity';
import { IdeaResponseDto } from '../idea/idea-response.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    const PASSWORD_SALT = 10;
    this.password = await bcrypt.hash(this.password, PASSWORD_SALT);
  }

  toResponseObject(showToken: boolean = false): UserResponseDto {
    const responseObject: UserResponseDto = {
      id: this.id,
      created: this.created,
      username: this.username,
    };

    if (showToken) {
      responseObject.token = this.token;
    }

    if (this.ideas) {
      responseObject.ideas = this.ideas.map(idea =>
        idea.toResponseObject(idea)
      );
    }

    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks.map(bookmark =>
        bookmark.toResponseObject(bookmark)
      );
    }

    return responseObject;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username, password } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' }
    );
  }
}
