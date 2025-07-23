import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { DataSource } from 'typeorm';
import { Tenant } from '../entities/Tenant';
import { Unit } from '../entities/Unit';
import { RentalContract } from '../entities/RentalContract';
import { RentalInvoice } from '../entities/RentalInvoice';
import { LoggerService } from '../utils/logger.service';
import { MigrationUtils } from '../utils/migration-utils';

export class RentRollMigrator {
  constructor(
    private dataSource: DataSource,
    private logger: LoggerService
  ) {}

  async run(csvPath: string): Promise<void> {
    const rows: any[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(path.resolve(csvPath))
          .pipe(csv())
          .on('data', (row: any) => rows.push(row))
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err));
      });
    } catch (err) {
      this.logger.logError(`Failed to read rentRoll CSV: ${err}`);
      return;
    }

    const batchSize = 100;
    let counter = 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const tenantRepo = queryRunner.manager.getRepository(Tenant);
    const unitRepo = queryRunner.manager.getRepository(Unit);
    const contractRepo = queryRunner.manager.getRepository(RentalContract);
    const invoiceRepo = queryRunner.manager.getRepository(RentalInvoice);

    try {
      await queryRunner.startTransaction();

      for (const row of rows) {
        const {
          facilityName, unitNumber,
          firstName, lastName, phone, email,
          rentStartDate, rentEndDate,
          monthlyRent, currentRentOwed, currentRentOwedDueDate
        } = row;

        if (!facilityName || !unitNumber || !firstName || !lastName || !email || !rentStartDate || !monthlyRent) {
          this.logger.logSkipped(row, 'missing required fields');
          continue;
        }

        const unit = await unitRepo.findOne({
          where: { number: unitNumber },
          relations: ['facility']
        });

        if (!unit || unit.facility.name !== facilityName) {
          this.logger.log(`Orphaned FK: unit '${unitNumber}' not found for facility '${facilityName}'`);
          continue;
        }

        const cleanPhone = MigrationUtils.sanitizePhoneNumber(phone, this.logger);
        const cleanEmail = MigrationUtils.sanitizeEmail(email, this.logger);

        let tenant = await tenantRepo.findOne({
          where: [
            { firstName, lastName, email: cleanEmail },
            { firstName, lastName, phone: cleanPhone }
          ]
        });

        if (tenant) {
          this.logger.log(`Reused existing tenant: ${firstName} ${lastName}`);
        } else {
          tenant = tenantRepo.create({
            firstName,
            lastName,
            phone: cleanPhone,
            email: cleanEmail
          });
          await tenantRepo.save(tenant);
          this.logger.log(`Created new tenant: ${firstName} ${lastName}`);
        }

        const rentalContract = contractRepo.create({
          unit,
          tenant,
          startDate: new Date(rentStartDate),
          endDate: rentEndDate ? new Date(rentEndDate) : null,
          currentAmountOwed: parseFloat(currentRentOwed || '0')
        });
        await contractRepo.save(rentalContract);

        const invoice = invoiceRepo.create({
          contract: rentalContract,
          invoiceDueDate: new Date(currentRentOwedDueDate),
          invoiceAmount: parseFloat(monthlyRent),
          invoiceBalance: parseFloat(currentRentOwed || '0')
        });
        await invoiceRepo.save(invoice);

        this.logger.log(`Inserted contract for tenant '${firstName} ${lastName}' on unit '${unitNumber}'`);

        counter++;
        if (counter % batchSize === 0) {
          await queryRunner.commitTransaction();
          this.logger.log(`Committed batch of ${batchSize} records`);
          await queryRunner.startTransaction();
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log('Final batch committed');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.logError(`Transaction failed and rolled back: ${err}`);
    } finally {
      await queryRunner.release();
    }
  }
}
