import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TournamentType } from './enums/tournament.enum';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';
import { Participant } from './entities/participant.entity';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(200), ParseIntPipe) limit: number,
    @Query('type', new DefaultValuePipe(TournamentType.ALL)) type: string,
  ): Promise<{
    data: Tournament[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    return await this.tournamentsService.findAll(page, limit, type);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Tournament | null> {
    return await this.tournamentsService.findOne(id);
  }

  @Post(':id/join')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async joinTournament(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Participant> {
    return await this.tournamentsService.joinTournament(id, req.user.sub);
  }
}
