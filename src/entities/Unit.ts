import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Facility } from './Facility';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  unitId!: number;

  @ManyToOne(() => Facility, (facility) => facility.units, { cascade: true })
  @JoinColumn({ name: 'facilityId' })
  facility!: Facility;

  @Column()
  number!: string;

  @Column('float')
  unitWidth!: number;

  @Column('float')
  unitLength!: number;

  @Column('float')
  unitHeight!: number;

  @Column()
  unitType!: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monthlyRent!: number;
}
