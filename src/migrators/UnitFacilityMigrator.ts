import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Repository } from 'typeorm';
import { Facility } from '../entities/Facility';
import { Unit } from '../entities/Unit';
import { LoggerService } from '../utils/logger.service';

export class UnitFacilityMigrator {
  constructor(
    private facilityRepo: Repository<Facility>,
    private unitRepo: Repository<Unit>,
    private logger: LoggerService
  ) {}

  async run(csvPath: string): Promise<void> {
    const units: any[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(path.resolve(csvPath))
          .pipe(csv())
          .on('data', (row: any) => units.push(row))
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err));
      });
    } catch (err) {
      this.logger.logError(`Failed to read unit CSV: ${err}`);
      return;
    }

    for (const row of units) {
      const { facilityName, unitNumber, unitSize, unitType } = row;

      if (!facilityName || !unitNumber || !unitSize || !unitType) {
        this.logger.logSkipped(row, 'missing required fields');
        continue;
      }

      const sizeMatch = unitSize.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
      if (!sizeMatch) {
        this.logger.log(`Malformed unitSize: '${unitSize}' in row: ${JSON.stringify(row)}`);
        continue;
      }

      const [_, width, length, height] = sizeMatch;

      let facility = await this.facilityRepo.findOne({ where: { name: facilityName } });
      if (!facility) {
        facility = this.facilityRepo.create({ name: facilityName });
        await this.facilityRepo.save(facility);
        this.logger.log(`Created new facility: ${facilityName}`);
      }

      const existingUnit = await this.unitRepo.findOne({
        where: {
        number: unitNumber,
        facility: { facilityId: facility.facilityId }
        },
        relations: ['facility']
      });

      if (existingUnit) {
        this.logger.log(`Skipped existing unit ${unitNumber} in facility '${facilityName}'`);
        continue;
      }

      const unit = this.unitRepo.create({
        facility,
        number: unitNumber,
        unitWidth: parseFloat(width),
        unitLength: parseFloat(length),
        unitHeight: parseFloat(height),
        unitType,
      });

      await this.unitRepo.save(unit);
      this.logger.log(`Inserted unit ${unitNumber} for facility '${facilityName}'`);
    }
  }
}
