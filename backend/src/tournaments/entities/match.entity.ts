import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Participant } from './participant.entity';

@Entity('matches')
@Index(['tournamentId'])
@Index(['participant1Id'])
@Index(['participant2Id'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'int', nullable: true })
  winner: number;

  @Column()
  tournamentId: number;

  @Column()
  participant1Id: number;

  @Column()
  participant2Id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant1Id' })
  participant1: Participant;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant2Id' })
  participant2: Participant;
}
