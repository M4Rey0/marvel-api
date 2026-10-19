import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Patch,
} from '@nestjs/common';

import { CharactersService } from './characters.service';
import { CharacterStatus } from './enums/character-status.enum';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly charactersService: CharactersService,
  ) {}

  @Get()
  findAll(
    @Query('status') status?: CharacterStatus,
    @Query('teamId') teamId?: string,
  ) {
    const parsedTeamId =
      teamId !== undefined
        ? Number(teamId)
        : undefined;

    return this.charactersService.findAll(
      status,
      parsedTeamId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(
    @Body()
    createCharacterDto: CreateCharacterDto,
  ) {
    return this.charactersService.create(
      createCharacterDto,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(
      id,
      updateCharacterDto,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.charactersService.updateStatus(
      id,
      updateStatusDto,
    );
  }
}