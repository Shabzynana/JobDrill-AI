import { User } from 'src/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
  } from 'typeorm';
  import { AbstractBaseEntity } from '../../database/base.entity';
import { Question } from '../../QnA/entities/question.entity';
@Entity()
export class InterviewSession extends AbstractBaseEntity {
 
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({ nullable: true })
  role: string;

  @Column("simple-array", { nullable: true })
  jobSkills: string[];

  @Column("simple-array", { nullable: true })
  jobResponsibilities: string[];

  @OneToMany(() => Question, (question) => question.session, {
    cascade: true,
    onDelete: "CASCADE",
  })
  questions: Question[];

}