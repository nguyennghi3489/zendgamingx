import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Participant } from './entities/participant.entity';
import { Match } from './entities/match.entity';
import { User } from '../users/entities/user.entity';
import { TournamentRepository } from './repositories/tournament.repository';
import { ParticipantRepository } from './repositories/participant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Participant, Match, User])],
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentRepository, ParticipantRepository],
})
export class TournamentsModule {}
