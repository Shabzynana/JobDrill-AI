import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../database/base.entity';
import { Answer } from './answer.entity';
import { InterviewSession } from '../../interviews/entities/interview.entity';

@Entity()
export class Question extends AbstractBaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => InterviewSession, (session) => session.questions, {
    onDelete: 'CASCADE',
  })
  session: InterviewSession;

  @OneToOne(() => Answer, (answer) => answer.question, {
    cascade: true,
  })
  answer: Answer;
}
