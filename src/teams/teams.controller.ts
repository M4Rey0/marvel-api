import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
  ) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.teamsService.findOne(id);
  }

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(
      createTeamDto,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(
      id,
      updateTeamDto,
    );
  }

}