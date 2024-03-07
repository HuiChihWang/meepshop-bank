import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class DBConfigService {
  constructor(private readonly configService: NestConfigService) {}

  getDBHost() {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDBPort() {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDBAuth() {
    return {
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
    };
  }

  getDBName() {
    return this.configService.get<string>('DATABASE_NAME');
  }
}
