import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from '../teams/entities/team.entity';
import { Character } from './entities/character.entity';
import { CharacterStatus } from './enums/character-status.enum';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  findAll(
    status?: CharacterStatus,
    teamId?: number,
  ): Promise<Character[]> {
    const where: {
      status?: CharacterStatus;
      teamId?: number;
    } = {};

    if (status) {
      where.status = status;
    }

    if (teamId !== undefined) {
      where.teamId = teamId;
    }

    return this.characterRepository.find({
      where,
    });
  }

  async findOne(id: number) {
    const character =
      await this.characterRepository.findOne({
        where: { id },
      });

    if (!character) {
      throw new NotFoundException(
        `No existe un personaje con id ${id}`,
      );
    }

    let team: Team | null = null;

    if (character.teamId !== null) {
      team = await this.teamRepository.findOne({
        where: { id: character.teamId },
      });
    }

    return {
      ...character,
      team,
    };
  }
}