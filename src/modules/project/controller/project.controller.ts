import { Request, Response, Router } from 'express';
//***************** use-cases **************//
import { CreateProjectUseCase } from '../application/use-cases/createProject.useCase';
import { GetProjectUseCase } from '../application/use-cases/getProject.useCase';
import { GetUserProjectsUseCase } from '../application/use-cases/getUserProjects.useCase';
import { UpdateProjectUseCase } from '../application/use-cases/updateProject.useCase';
import { DeleteProjectUseCase } from '../application/use-cases/deleteProject.useCase';
//***************** DTOs **************//
import { CreateProjectDto } from '../application/dto/createProject.dto';
import { UpdateProjectDto } from '../application/dto/updateProject.dto';
//***************** services **************//
import { ProjectRepository } from '../infrastructure/persistence/project.repository';
import { handleResponse, HttpCode } from '../../../helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';
//***************** validators **************//
import { validateCreateProject } from '../validator/createProject.validator';
import { validateGetProject } from '../validator/getProject.validator';
import { validateGetUserProjects } from '../validator/getUserProjects.validator';
import { validateUpdateProject } from '../validator/updateProject.validator';
import { validateDeleteProject } from '../validator/deleteProject.validator';

// Instancia del repositorio necesario
const projectRepository = new ProjectRepository();

// Instancia de casos de uso
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const getProjectUseCase = new GetProjectUseCase(projectRepository);
const getUserProjectsUseCase = new GetUserProjectsUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

export const ProjectControllers = Router();

/**
 * Create a new project
 */
ProjectControllers.post("/", validateCreateProject, asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;
  
  const createProjectDto = new CreateProjectDto(name, userId, description);
  const project = await createProjectUseCase.execute(createProjectDto);

  handleResponse(res, HttpCode.CREATED, project);
}));

/**
 * Get a project by ID
 */
ProjectControllers.get("/:id", validateGetProject, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await getProjectUseCase.execute(id);

  handleResponse(res, HttpCode.OK, project);
}));

/**
 * Get all projects for the authenticated user
 */
ProjectControllers.get("/", validateGetUserProjects, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const projects = await getUserProjectsUseCase.execute(userId);

  handleResponse(res, HttpCode.OK, projects);
}));

/**
 * Update a project
 */
ProjectControllers.put("/:id", validateUpdateProject, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const updateProjectDto = new UpdateProjectDto(id, name, description);
  const project = await updateProjectUseCase.execute(updateProjectDto);

  handleResponse(res, HttpCode.OK, project);
}));

/**
 * Delete a project
 */
ProjectControllers.delete("/:id", validateDeleteProject, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  await deleteProjectUseCase.execute(id, userId);

  handleResponse(res, HttpCode.OK, { message: "Project deleted successfully" });
}));
