import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TournamentType } from './enums/tournament.enum';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
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
}
