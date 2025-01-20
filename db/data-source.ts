import { DataSource, DataSourceOptions } from 'typeorm';
import { District } from './entities/District.entity';
import { Inquiries } from './entities/Inquiries.entity';
import { PackageType } from './entities/PackageType.entity';
import { Properties } from './entities/Properties.entity';
import { PropertyImages } from './entities/propertyimages.entity';
import { PropertyTypes } from './entities/propertytypes.entity';
import { Province } from './entities/Province.entity';
import { ReportProperty } from './entities/ReportProperty.entity';
import { Transactions } from './entities/Transactions.entity';
import { Users } from './entities/users.entity';
import { Ward } from './entities/Ward.entity';

export const dataSoureOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'cu0n7h5svqrc73eo4rfg-a.oregon-postgres.render.com',
  // host: 'localhost',
  port: 5432,
  username: 'datntronggnhia_user',
  // username: 'postgres',
  password: 'kfjpKzuHRLkUakG8btSukpzxbhOYhVUI',
  // password: '123456',
  database: 'datntronggnhia',
  // database: 'DATN',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    Province,
    District,
    Ward,
    Users,
    Properties,
    PropertyImages,
    PropertyTypes,
    PackageType,
    Transactions,
    Inquiries,
    ReportProperty,
  ],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  logging: true,
};
const dataSoure = new DataSource(dataSoureOptions);
export default dataSoure;
