import { Injectable } from '@nestjs/common';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Participant } from '../entities/participant.entity';

@Injectable()
export class ParticipantRepository {
  private repository: Repository<Participant>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Participant);
  }

  private getRepository(manager?: EntityManager): Repository<Participant> {
    return manager ? manager.getRepository(Participant) : this.repository;
  }

  async isUserAlreadyRegistered(
    tournamentId: number,
    userId: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    const participantRepo = this.getRepository(manager);

    const existingParticipant = await participantRepo.findOne({
      where: { tournamentId, userId },
      lock: { mode: 'pessimistic_write' },
    });

    return !!existingParticipant;
  }

  async countParticipantsOnTournament(
    tournamentId: number,
    manager?: EntityManager,
  ): Promise<number> {
    const participantRepo = this.getRepository(manager);
    return await participantRepo.count({
      where: { tournamentId },
    });
  }

  async createParticipant(
    tournamentId: number,
    userId: number,
    manager?: EntityManager,
  ): Promise<Participant> {
    const repo = this.getRepository(manager);

    const participant = repo.create({
      tournamentId,
      userId,
      score: 0,
      status: 'registered',
    });

    return await repo.save(participant);
  }
}
