import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectDistributeCommand } from './project-dispatcher.command';
import { DistributedProjectResponse } from '../dao/distributed-project.dao';
import { ProjectsDispatcher } from '../shared/distribute-project-dispatch.service';
import { SiaCreateProjectDto } from '@root/sia/zod-schema/sia.create-project.schema';
import { QrTrackCreateProjectDto } from '@root/qr-track/zod-schema/qr-track.create-project.schema';

@CommandHandler(CreateProjectDistributeCommand)
export class CreateProjectDistributeHandler
  implements ICommandHandler<CreateProjectDistributeCommand>
{
  constructor(private projectDispatchService: ProjectsDispatcher) {}
  async execute(
    command: CreateProjectDistributeCommand,
  ): Promise<DistributedProjectResponse> {
    const siaProjectDto: SiaCreateProjectDto = {
      CompanyID: command.companyId,
      Number: command.number,
      Name: command.name,
      ProjectStatus: command.status,
      UserText4: command.projectType,
      ProjectID: command.projectId,
      Udf_PS: '',
    };

    const qrTrackProjectDto: QrTrackCreateProjectDto = {
      name: command.name,
      sector_type: command.projectType,
    };
    try {
      await this.projectDispatchService.projectsDispatcherHandler({
        sia: siaProjectDto,
        qr_track: qrTrackProjectDto,
      });

      return {
        message: 'Success Distribute and Create Project',
      };
    } catch (error) {
      throw error;
    }
  }
}
