import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TournamentRepository } from './repositories/tournament.repository';
import { TournamentType } from './enums/tournament.enum';
import { Tournament } from './entities/tournament.entity';
import type { Cache } from 'cache-manager';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { ParticipantRepository } from './repositories/participant.repository';

@Injectable()
export class TournamentsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectDataSource()
    private dataSource: DataSource,
    private tournamentRepository: TournamentRepository,
    private participantRepository: ParticipantRepository,
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

    await this.cacheManager.set(cacheKey, result, 60000);

    return result;
  }

  async findOne(id: number): Promise<Tournament | null> {
    const cacheKey = `tournament:${id}`;

    const cached = await this.cacheManager.get<Tournament>(cacheKey);
    if (cached) {
      return cached;
    }

    const tournament = await this.tournamentRepository.findOneById(id);

    if (tournament) {
      await this.cacheManager.set(cacheKey, tournament, 30000);
    }

    return tournament;
  }

  async joinTournament(
    tournamentId: number,
    userId: number,
  ): Promise<Participant> {
    return await this.dataSource.transaction(async (manager) => {
      const tournament =
        await this.tournamentRepository.isAvailableForRegistration(
          tournamentId,
          manager,
        );

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }
      if (tournament.status !== 'pending') {
        throw new NotFoundException('Tournament is not open for registration');
      }

      const isAlreadyRegistered =
        await this.participantRepository.isUserAlreadyRegistered(
          tournamentId,
          userId,
          manager,
        );

      if (isAlreadyRegistered) {
        throw new BadRequestException(
          'User is already registered for this tournament',
        );
      }

      const currentParticipantNumber =
        await this.participantRepository.countParticipantsOnTournament(
          tournamentId,
          manager,
        );

      if (currentParticipantNumber >= tournament.maxParticipants) {
        throw new BadRequestException(
          `Tournament is full (${currentParticipantNumber}/${tournament.maxParticipants})`,
        );
      }

      const savedParticipant =
        await this.participantRepository.createParticipant(
          tournamentId,
          userId,
          manager,
        );

      await this.cacheManager.del(`tournament:${tournamentId}`);

      return savedParticipant;
    });
  }
}
