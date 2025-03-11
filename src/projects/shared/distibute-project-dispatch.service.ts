import { Injectable } from '@nestjs/common';
import { SiaRepo } from '@root/sia/repo/sia.repo';
import { QrTrackRepo } from '@root/qr-track/repo/qr-track.repo';
import { SiaCreateProjectDto } from '../../sia/zod-schema/sia.create-project.schema';
import { QrTrackCreateProjectDto } from '../../qr-track/zod-schema/qr-track.create-project.schema';

export interface ProjectsDtoDispatcher {
  sia: SiaCreateProjectDto;
  qr_track: QrTrackCreateProjectDto;
}

@Injectable()
export class ProjectsDispatcher {
  constructor(
    private siaRepo: SiaRepo,
    private qrTrackRepo: QrTrackRepo,
  ) {}

  async projectsDispatcherHandler(): Promise<void> {}
}
