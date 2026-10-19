import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  base: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  foundedYear: number;

  @IsBoolean()
  active: boolean;
}