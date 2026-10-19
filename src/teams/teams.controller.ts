import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';

import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';

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

@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.teamsService.remove(id);
}

@Get(':id/characters')
findCharacters(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.teamsService.findCharacters(id);
}

@Patch(':id/characters')
assignCharacters(
  @Param('id', ParseIntPipe) id: number,
  @Body() assignCharactersDto: AssignCharactersDto,
) {
  return this.teamsService.assignCharacters(
    id,
    assignCharactersDto,
  );
}

}