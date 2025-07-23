import { DataSource } from "typeorm";
import { Facility } from "./entities/Facility";
import { Tenant } from "./entities/Tenant";
import { RentalContract } from "./entities/RentalContract";
import { RentalInvoice } from "./entities/RentalInvoice";
import { Unit } from "./entities/Unit";
import { config } from "dotenv";
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [Facility, Unit, Tenant, RentalContract, RentalInvoice],
});

export{}