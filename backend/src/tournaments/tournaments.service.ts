import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { TournamentRepository } from './repositories/tournament.repository';
import { TournamentType } from './enums/tournament.enum';
import { Tournament } from './entities/tournament.entity';
import type { Cache } from 'cache-manager';

@Injectable()
export class TournamentsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private tournamentRepository: TournamentRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = TournamentType.ALL,
  ): Promise<{
    data: Tournament[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const cacheKey = `tournaments:page:${page}:limit:${limit}:type:${type}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<{
      data: Tournament[];
      meta: {
        total: number;
        page: number;
        limit: number;
      };
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Use custom repository method for filtering by type
    const [tournaments, total] = await this.tournamentRepository.findByType(
      type,
      page,
      limit,
    );

    const result = {
      data: tournaments,
      meta: {
        total,
        page,
        limit,
      },
    };

    // Cache for 60 seconds
    await this.cacheManager.set(cacheKey, result, 60000);

    return result;
  }
}
