import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../enums/character-status.enum';

export class UpdateStatusDto {
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
}