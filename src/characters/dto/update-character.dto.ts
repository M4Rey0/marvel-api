import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { CharacterStatus } from '../enums/character-status.enum';

export class UpdateCharacterDto {
  @IsString()
  @IsNotEmpty()
  realName: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  mainPower: string;

  @IsInt()
  @Min(1)
  @Max(100)
  powerLevel: number;

  @IsEnum(CharacterStatus)
  status: CharacterStatus;

  @IsBoolean()
  isVillain: boolean;

  @IsOptional()
  @IsInt()
  teamId?: number | null;
}