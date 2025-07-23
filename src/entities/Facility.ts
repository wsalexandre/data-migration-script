import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Unit } from "./Unit";

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  facilityId!: number;

  @Column({ unique: true })
  name: string = '';

  @OneToMany(() => Unit, (unit) => unit.facility)
  units!: Unit[];
}
