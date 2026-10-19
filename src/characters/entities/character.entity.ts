import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CharacterStatus } from '../enums/character-status.enum';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'real_name',
    type: 'varchar',
    length: 100,
  })
  realName: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  alias: string;

  @Column({
    name: 'main_power',
    type: 'varchar',
    length: 150,
  })
  mainPower: string;

  @Column({
    name: 'power_level',
    type: 'int',
  })
  powerLevel: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status: CharacterStatus;

  @Column({
    name: 'is_villain',
    type: 'boolean',
  })
  isVillain: boolean;

  @Column({
    name: 'team_id',
    type: 'int',
    nullable: true,
  })
  teamId: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}