import { Module } from '@nestjs/common';
import { EmployeeService } from '@root/employee/employee.service';

@Module({
  providers: [EmployeeService],
})
export class EmployeeModule {}
