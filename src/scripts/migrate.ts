import { AppDataSource } from '../data-source';
import { LoggerService } from '../utils/logger.service';
import { UnitFacilityMigrator } from '../migrators/UnitFacilityMigrator';
import { RentRollMigrator } from '../migrators/RentRollMigrator';
import { Facility } from '../entities/Facility';
import { Unit } from '../entities/Unit';
import { Tenant } from '../entities/Tenant';
import { RentalContract } from '../entities/RentalContract';
import { RentalInvoice } from '../entities/RentalInvoice';
import { config } from 'dotenv';
config();

async function main() {
  const logger = new LoggerService('migration.log');
  logger.log('=== MIGRATION STARTED ===');

  try {
    const connection = await AppDataSource.initialize();
    logger.log('Connected to database');

    //Facilities & Units - Migrate
    logger.log('--- Migrating Facilities & Units ---');
    const unitFacilityMigrator = new UnitFacilityMigrator(
      connection.getRepository(Facility),
      connection.getRepository(Unit),
      logger
    );
    await unitFacilityMigrator.run('seeds/unit.csv');
    logger.log('Facilities & Units migration complete');

    //Rent Roll - Migrate
    logger.log('--- Migrating Rent Roll ---');
    const rentRollMigrator = new RentRollMigrator(connection, logger);
    await rentRollMigrator.run('seeds/rentRoll.csv');
    logger.log('Rent Roll migration complete');


    logger.log('=== ALL MIGRATIONS COMPLETED SUCCESSFULLY. ===');
    logger.log(`View this log in: ${logger.getLogFilePath()}`);
    await connection.destroy();
  } catch (error) {
    const errMsg = error instanceof Error ? error : String(error);
    logger.logError(errMsg);
    logger.log('XXX MIGRATION FAILED. XXX');
  } finally {
    logger.end();
    process.exit(0);
  }
}

main();
