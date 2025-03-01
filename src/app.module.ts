import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { envSchema } from './config/env/env.schema';
import { EnvModule } from './config/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    EmployeeModule,
    EnvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
