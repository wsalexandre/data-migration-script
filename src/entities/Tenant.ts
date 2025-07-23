import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { RentalContract } from './RentalContract';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  tenantId!: number;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 20 })
  phone!: string;

  @OneToMany(() => RentalContract, (contract) => contract.tenant)
  contracts!: RentalContract[];

}