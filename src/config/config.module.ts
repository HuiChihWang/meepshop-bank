import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { DBConfigService } from './db-config.service';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`./config/.env.development`],
    }),
  ],
  providers: [DBConfigService, AppConfigService],
  exports: [DBConfigService, AppConfigService],
})
export class ConfigModule {}
