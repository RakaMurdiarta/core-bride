import { Inject, Injectable } from '@nestjs/common';
import { SiaRepo } from '@root/sia/repo/sia.repo';
import { QrTrackRepo } from '@root/qr-track/repo/qr-track.repo';
import { SiaCreateProjectDto } from '@root/sia/zod-schema/sia.create-project.schema';
import { QrTrackCreateProjectDto } from '@root/qr-track/zod-schema/qr-track.create-project.schema';
import Logger, { LoggerKey } from '@app/commons/logger/domain/logger';

export interface ProjectsDtoDispatcher {
  sia: SiaCreateProjectDto;
  qr_track: QrTrackCreateProjectDto;
}

@Injectable()
export class ProjectsDispatcher {
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private siaRepo: SiaRepo,
    private qrTrackRepo: QrTrackRepo,
  ) {}

  async projectsDispatcherHandler(args: ProjectsDtoDispatcher): Promise<void> {
    const siaConneciton = await this.siaRepo.connectionPool.getConnection();
    const qrTrackConneciton =
      await this.qrTrackRepo.connectionPool.getConnection();

    try {
      this.logger.info('DB Transaction Begin');
      await siaConneciton.beginTransaction();
      await qrTrackConneciton.beginTransaction();

      //check project already exist or not
      await this.siaRepo.createProject(args.sia, siaConneciton);
      await this.qrTrackRepo.createProject(args.qr_track, qrTrackConneciton);

      this.logger.info('DB Transaction Commit');

      await siaConneciton.commit();
      await qrTrackConneciton.commit();
    } catch (error) {
      this.logger.error('DB Transaction Rollback', {
        props: {
          errors: error,
        },
      });

      await siaConneciton.rollback();
      await qrTrackConneciton.rollback();
    } finally {
      siaConneciton.release();
      qrTrackConneciton.release();
    }
  }
}
