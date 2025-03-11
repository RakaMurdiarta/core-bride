import { Module } from '@nestjs/common';
import { DatabasePlainModule } from '@app/commons/db-plain-sql/plain-db-module';
import { EnvService } from '@app/commons/config/env/env.service';

@Module({
  imports: [
    DatabasePlainModule.registerAsync({
      useFactory: (env: EnvService) => {
        return {
          host: env.get('DB_QR_TRACK_HOST'),
          user: env.get('DB_QR_TRACK_USER'),
          password: env.get('DB_QR_TRACK_PWD'),
          database: env.get('DB_QR_TRACK_NAME'),
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 100,
          port: env.get('DB_QR_TRACK_PORT'),
        };
      },
      inject: [EnvService],
    }),
  ],
  exports: [],
})
export class QRTrackModule {}
