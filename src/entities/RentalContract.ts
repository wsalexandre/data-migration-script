import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Unit } from './Unit';
import { Tenant } from './Tenant';
import { RentalInvoice } from './RentalInvoice';

@Entity('rentalcontract')
export class RentalContract {
  @PrimaryGeneratedColumn()
  rentalContractId!: number;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'renterId' }) /* This field name is incorrect in the schema passed, assuming is tenant */
  tenant!: Tenant;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate!: Date | null;

  @Column('decimal', { precision: 10, scale: 2 })
  currentAmountOwed!: number;

  @OneToOne(() => RentalInvoice, (invoice) => invoice.contract)
  invoice!: RentalInvoice;
}
