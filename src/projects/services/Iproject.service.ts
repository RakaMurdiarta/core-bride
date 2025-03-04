import { CreateProjectDto } from '@root/projects/dtos/create-project.dto';
import { CreateProjectResponse } from '../dao/create-project.dao';
// import { UpdateProjectDto } from '@root/projects/dtos/update-project.dto';

export interface IProjectService {
  createProject(arg: CreateProjectDto): Promise<CreateProjectResponse>;
  // updateProject(arg?: UpdateProjectDto): Promise<void>;
}
