import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from '../teams/entities/team.entity';
import { Character } from './entities/character.entity';
import { CharacterStatus } from './enums/character-status.enum';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

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
    async create(
    dto: CreateCharacterDto,
    ): Promise<Character> {
    const existingCharacter =
        await this.characterRepository.findOne({
        where: { alias: dto.alias },
        });

    if (existingCharacter) {
        throw new ConflictException(
        `Ya existe un personaje con el alias ${dto.alias}`,
        );
    }

    if (dto.teamId !== undefined) {
        const team =
        await this.teamRepository.findOne({
            where: { id: dto.teamId },
        });

        if (!team) {
        throw new NotFoundException(
            `No existe un equipo con id ${dto.teamId}`,
        );
        }

        if (!team.active) {
        throw new BadRequestException(
            'No se puede asignar un personaje a un equipo inactivo',
        );
        }
    }

    const character =
        this.characterRepository.create({
        realName: dto.realName,
        alias: dto.alias,
        mainPower: dto.mainPower,
        powerLevel: dto.powerLevel,
        status: dto.status,
        isVillain: dto.isVillain,
        teamId: dto.teamId ?? null,
        });

    return this.characterRepository.save(
        character,
    );
    }

    async update(
    id: number,
    dto: UpdateCharacterDto,
    ): Promise<Character> {

    const character =
        await this.characterRepository.findOne({
        where: { id },
        });

    if (!character) {
        throw new NotFoundException(
        `No existe un personaje con id ${id}`,
        );
    }

    const characterWithSameAlias =
        await this.characterRepository.findOne({
        where: { alias: dto.alias },
        });

    if (
        characterWithSameAlias &&
        characterWithSameAlias.id !== id
    ) {
        throw new ConflictException(
        `Ya existe un personaje con el alias ${dto.alias}`,
        );
    }

    if (dto.teamId !== undefined && dto.teamId !== null) {
        const team =
        await this.teamRepository.findOne({
            where: { id: dto.teamId },
        });

        if (!team) {
        throw new NotFoundException(
            `No existe un equipo con id ${dto.teamId}`,
        );
        }

        if (!team.active) {
        throw new BadRequestException(
            'No se puede asignar un personaje a un equipo inactivo',
        );
        }
    }

    character.realName = dto.realName;
    character.alias = dto.alias;
    character.mainPower = dto.mainPower;
    character.powerLevel = dto.powerLevel;
    character.status = dto.status;
    character.isVillain = dto.isVillain;
    character.teamId = dto.teamId ?? null;

    return this.characterRepository.save(character);
    }
  
    async updateStatus(
    id: number,
    dto: UpdateStatusDto,
    ): Promise<Character> {
    const character =
        await this.characterRepository.findOne({
        where: { id },
        });

    if (!character) {
        throw new NotFoundException(
        `No existe un personaje con id ${id}`,
        );
    }

    if (
        character.status === CharacterStatus.RETIRED &&
        dto.status === CharacterStatus.INJURED
    ) {
        throw new BadRequestException(
        'Un personaje RETIRED no puede pasar directamente a INJURED',
        );
    }

    character.status = dto.status;

    return this.characterRepository.save(character);
    }
}