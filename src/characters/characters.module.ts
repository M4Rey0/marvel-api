import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from '../teams/entities/team.entity';
import { Character } from './entities/character.entity';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character,
      Team,
    ]),
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}