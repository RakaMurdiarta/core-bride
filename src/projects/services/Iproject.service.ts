import { UpdateProjectResponse } from '@root/projects/dao/update-project.dao';
import { CreateProjectDto } from '@root/projects/zod-schema/create-project.schema';
import { UpdateProjectDto } from '@root/projects/zod-schema/update-project.schema';

export interface IProjectService {
  createProject(arg: CreateProjectDto): Promise<string>;
  updateProject(arg: UpdateProjectDto): Promise<UpdateProjectResponse>;
  // projectDistributeDispatch(args: CreateProjectDto): Promise<void>;
}
