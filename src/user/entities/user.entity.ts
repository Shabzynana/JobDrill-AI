import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../database/base.entity';

export enum AuthType {
  GOOGLE = 'google',
  LOCAL = 'local',
}

@Entity({ name: 'users' })
export class User extends AbstractBaseEntity {
  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  is_verified_date: Date;

  @Column({ 
    type: 'enum', 
    enum: AuthType, 
    default: AuthType.LOCAL 
  })
  auth_type: AuthType;

  @OneToMany(() => InterviewSession, (session) => session.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions: InterviewSession[];
}
