import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponseDto } from './user-response.dto';
import { IdeaEntity } from '../idea/idea.entity';

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

  @BeforeInsert()
  async hashPassword() {
    const PASSWORD_SALT = 10;
    this.password = await bcrypt.hash(this.password, PASSWORD_SALT);
  }

  toResponseObject(showToken: boolean = true) {
    const { id, created, username, token } = this;
    const responseObject: UserResponseDto = { id, created, username };
    if (showToken) {
      responseObject.token = token;
    }
    if (this.ideas) {
      responseObject.ideas = this.ideas;
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
