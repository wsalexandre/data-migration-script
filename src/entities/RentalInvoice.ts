import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RentalContract } from './RentalContract';

@Entity('rentalinvoice')
export class RentalInvoice {
  @PrimaryGeneratedColumn()
  invoiceId!: number;

  @ManyToOne(() => RentalContract)
  @JoinColumn({ name: 'rentalContractId' })
  contract!: RentalContract;

  @Column({ type: 'timestamp' })
  invoiceDueDate!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  invoiceAmount!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  invoiceBalance!: number;
}
