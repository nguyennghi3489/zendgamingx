import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Participant } from './participant.entity';
import { Match } from './match.entity';

@Entity('tournaments')
@Index(['startTime', 'status'])
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  maxParticipants: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @OneToMany(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];
}
