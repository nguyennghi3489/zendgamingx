import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';

@Injectable()
export class TournamentRepository {
  private repository: Repository<Tournament>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Tournament);
  }

  async findByType(
    type: string,
    page: number,
    limit: number,
  ): Promise<[Tournament[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('tournament');

    // Apply filters based on type
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
        // No additional filters for 'all'
        break;
    }

    queryBuilder
      .orderBy('tournament.startTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return await queryBuilder.getManyAndCount();
  }
}
