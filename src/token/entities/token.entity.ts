// src/auth/token.entity.ts
import { AbstractBaseEntity } from 'src/database/base.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TokenType } from '../dto/token_type';

@Entity()
export class Token extends AbstractBaseEntity {
  @Column({ unique: true })
  uuid: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column('bigint')
  expires_in: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
