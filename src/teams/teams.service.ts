import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Character } from '../characters/entities/character.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(
        `No existe un equipo con id ${id}`,
      );
    }

    return team;
  }

  async create(dto: CreateTeamDto): Promise<Team> {
  
    const existingTeam =
      await this.teamRepository.findOne({
        where: { name: dto.name },
      });

    if (existingTeam) {
      throw new ConflictException(
        `Ya existe un equipo llamado ${dto.name}`,
      );
    }

    const characterIds = dto.characterIds ?? [];

    
    if (
      characterIds.length > 0 &&
      dto.active === false
    ) {
      throw new BadRequestException(
        'No se pueden asignar personajes a un equipo inactivo',
      );
    }

    
    let characters: Character[] = [];

    if (characterIds.length > 0) {
      characters =
        await this.characterRepository.findBy({
          id: In(characterIds),
        });

      if (characters.length !== characterIds.length) {
        const foundIds = characters.map(
          (character) => character.id,
        );

        const missingIds = characterIds.filter(
          (id) => !foundIds.includes(id),
        );

        throw new NotFoundException(
          `No existen los personajes con id: ${missingIds.join(', ')}`,
        );
      }
    }

    
    const team = this.teamRepository.create({
      name: dto.name,
      base: dto.base ?? null,
      foundedYear: dto.foundedYear ?? null,
      active: dto.active ?? true,
    });

    const savedTeam =
      await this.teamRepository.save(team);

    
    if (characters.length > 0) {
      for (const character of characters) {
        character.teamId = savedTeam.id;
      }

      await this.characterRepository.save(
        characters,
      );
    }

    return savedTeam;
  }

    async update(
    id: number,
    dto: UpdateTeamDto,
  ): Promise<Team> {
    
    const team = await this.findOne(id);

    const teamWithSameName =
      await this.teamRepository.findOne({
        where: { name: dto.name },
      });

    if (
      teamWithSameName &&
      teamWithSameName.id !== id
    ) {
      throw new ConflictException(
        `Ya existe un equipo llamado ${dto.name}`,
      );
    }

    team.name = dto.name;
    team.base = dto.base;
    team.foundedYear = dto.foundedYear;
    team.active = dto.active;

    return this.teamRepository.save(team);
  }

  async remove(id: number): Promise<Team> {
  
  const team = await this.findOne(id);

  
  const characterCount =
    await this.characterRepository.count({
      where: { teamId: id },
    });

  
  if (characterCount > 0) {
    throw new ConflictException(
      'No se puede eliminar un equipo con personajes asociados',
    );
  }

  
  await this.teamRepository.remove(team);

  return team;
}

async findCharacters(id: number): Promise<Character[]> {
  await this.findOne(id);

  return this.characterRepository.find({
    where: { teamId: id },
  });
}

}