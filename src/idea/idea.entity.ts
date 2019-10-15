import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('text') idea: string;
  @Column('text') description: string;
  @CreateDateColumn() created: Date;
}
