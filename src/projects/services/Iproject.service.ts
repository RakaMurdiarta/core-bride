import { CreateProjectDto } from '@root/projects/dtos/create-project.dto';
// import { UpdateProjectDto } from '@root/projects/dtos/update-project.dto';

export interface IProjectService {
  createProject(arg: CreateProjectDto): Promise<{ id: string }>;
  // updateProject(arg?: UpdateProjectDto): Promise<void>;
}
