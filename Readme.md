# Data Migration Script

This project is a TypeScript-based tool to perform data migration from CSV files into a MySQL database using TypeORM.

## Features

- Multi-entity migration (Units, Tenants, Contracts, Invoices)
- Logger with file output
- Validation & sanitization for email/phone
- Transactions with batch commits (rentRoll.csv only)

## Setup
npm install
cp .env.example .env

## Edit/Create the .env file with your database connection info:
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database

## Run Migration
npx ts-node src/scripts/migrate.ts

## Database Schema

Before running the migration, make sure your database schema is initialized:
```bash
mysql -u <user> -p <database> < seeds/schema.sql
```

## Schema Fix Summary - IMPORTANT - 
    1. Column typo in `facility`
    Changed `faciliyId` to `facilityId` to match the foreign key in `unit`.

    2. Foreign key mismatch in `rentalContract`
    Original FK pointed to `tenantId`, but the correct column is `renterId`. Fixed FK to reference `renterId`.

    3. Primary key issue in `rentalInvoice`
    Using `rentalContractId` as PK blocked multiple invoices.
    Added `invoiceId` as new PK and kept `rentalContractId` as FK.

    4. Missing auto-increment in `unit`
    Added `AUTO_INCREMENT` to `unitId` for automatic value generation.

    5. I suggest to define a composite unique constraint on a combination of fields, but I decided to handle it in the code 
        ALTER TABLE tenant ADD CONSTRAINT unique_tenant_identity UNIQUE (firstName, lastName, email, phone);
        ALTER TABLE rentalcontract ADD UNIQUE KEY uq_contract (unitId, renterId, startDate);
        ALTER TABLE rentalinvoice ADD UNIQUE KEY uq_invoice (rentalContractId, invoiceDueDate);
