import { Controller, Get, Inject } from '@nestjs/common';
import Logger, { LoggerKey } from '../logger/domain/logger';

@Controller('employee')
export class EmployeeController {
  constructor(@Inject(LoggerKey) private logger: Logger) {}
  @Get()
  getEmployees() {
    this.logger.warn('user request');
    return 'this is employee';
  }
}
