import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmployeeService {
  constructor(private configService: ConfigService) {}

  getEnv() {
    return this.configService.get('PORT');
  }
}
