import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Participant } from './entities/participant.entity';
import { User } from '../users/entities/user.entity';
import { TournamentRepository } from './repositories/tournament.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Participant, User])],
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentRepository],
})
export class TournamentsModule {}
