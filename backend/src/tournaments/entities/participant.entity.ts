import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { User } from '../../users/entities/user.entity';

@Entity('participants')
@Index(['tournamentId'])
@Index(['userId'])
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime' })
  joinedAt: Date;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column()
  tournamentId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.id)
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
