import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from './config/config.module';
import { DBConfigService } from './config/db-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DBConfigService],
      useFactory: (dbConfig: DBConfigService) => ({
        type: 'postgres',
        host: dbConfig.getDBHost(),
        port: dbConfig.getDBPort(),
        username: dbConfig.getDBAuth().username,
        password: dbConfig.getDBAuth().password,
        database: dbConfig.getDBName(),
        // TODO: remove this from production
        synchronize: true,
      }),
    }),
    TransactionModule,
    ConfigModule,
  ],
  providers: [],
})
export class AppModule {}
