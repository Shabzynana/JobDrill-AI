import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
  } from 'typeorm';
import { AbstractBaseEntity } from '../../database/base.entity';
import { Question } from './question.entity';

@Entity()
export class Answer extends AbstractBaseEntity {

  @Column("text")
  content: string;

  @Column()
  score: number;

  @Column("text", { nullable: true })
  feedback: string;

  @OneToOne(() => Question, (question) => question.answer)
  @JoinColumn()
  question: Question;
}