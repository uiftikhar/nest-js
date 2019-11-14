import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { IdeaResponseDto } from './idea-response.dto';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];

  @OneToMany(_ => CommentEntity, comment => comment.idea, {
    cascade: true,
  })
  comments: CommentEntity[];

  toResponseObject(idea: Partial<IdeaEntity>): IdeaResponseDto {
    const responseObj: IdeaResponseDto = {
      id: idea.id,
      created: idea.created,
      updated: idea.updated,
      idea: idea.idea,
      description: idea.description,
      upvotes: idea.upvotes ? idea.upvotes.length : 0,
      downvotes: idea.downvotes ? idea.downvotes.length : 0,
    };

    if (idea.author) {
      responseObj.author = idea.author.toResponseObject();
    }

    if (idea.comments) {
      responseObj.comments = this.formatComments(idea.comments);
    }

    return responseObj;
  }

  private formatComments(comments: CommentEntity[]) {
    return comments.map(comment => comment.comment);
  }
}
