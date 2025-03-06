import { CreateProjectDto } from '@root/projects/dtos/create-project.dto';
import { CreateProjectResponse } from '@root/projects/dao/create-project.dao';
import { UpdateProjectDto } from '@root/projects/dtos/update-project.dto';
import { UpdateProjectResponse } from '@root/projects/dao/update-project.dao';

export interface IProjectService {
  createProject(arg: CreateProjectDto): Promise<CreateProjectResponse>;
  updateProject(arg: UpdateProjectDto): Promise<UpdateProjectResponse>;
}
