import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
  } from 'typeorm';
  import { AbstractBaseEntity } from '../../database/base.entity';
import { Answer } from './answer.entity';
import { InterviewSession } from './interview.entity';

@Entity()
export class Question extends AbstractBaseEntity {

  @Column()
  content: string;

  @ManyToOne(() => InterviewSession, (session) => session.questions)
  session: InterviewSession;

  @OneToOne(() => Answer, (answer) => answer.question, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answer: Answer;
}