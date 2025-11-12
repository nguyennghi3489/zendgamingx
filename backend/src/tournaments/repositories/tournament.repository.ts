import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class TournamentRepository {
  private repository: Repository<Tournament>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Tournament);
  }

  private getRepository(manager?: EntityManager): Repository<Tournament> {
    return manager ? manager.getRepository(Tournament) : this.repository;
  }

  async findByType(
    type: string,
    page: number,
    limit: number,
  ): Promise<[Tournament[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('tournament');

    switch (type.toLowerCase()) {
      case 'upcoming':
        queryBuilder
          .where('tournament.startTime > :now', { now: new Date() })
          .andWhere('tournament.status = :status', {
            status: 'pending',
          });
        break;
      case 'active':
        queryBuilder.where('tournament.status = :status', {
          status: 'active',
        });
        break;
      case 'completed':
        queryBuilder.where('tournament.status = :status', {
          status: 'completed',
        });
        break;
      case 'pending':
        queryBuilder.where('tournament.status = :status', {
          status: 'pending',
        });
        break;
      case 'all':
      default:
        break;
    }

    queryBuilder
      .orderBy('tournament.startTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return await queryBuilder.getManyAndCount();
  }

  async findOneById(id: number): Promise<Tournament | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['participants', 'participants.user', 'matches'],
    });
  }

  async isAvailableForRegistration(
    tournamentId: number,
    manager?: EntityManager,
  ): Promise<Tournament | null> {
    const repo = this.getRepository(manager);
    return await repo.findOne({
      where: { id: tournamentId },
      lock: { mode: 'pessimistic_write' },
    });
  }
}
