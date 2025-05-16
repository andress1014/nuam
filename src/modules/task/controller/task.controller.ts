import { Request, Response, Router } from 'express';
//***************** use-cases **************//
import { CreateTaskUseCase } from '../application/use-cases/createTask.useCase';
import { GetTaskUseCase } from '../application/use-cases/getTask.useCase';
import { GetProjectTasksUseCase } from '../application/use-cases/getProjectTasks.useCase';
import { UpdateTaskUseCase } from '../application/use-cases/updateTask.useCase';
import { DeleteTaskUseCase } from '../application/use-cases/deleteTask.useCase';
import { AddTaskCommentUseCase } from '../application/use-cases/addTaskComment.useCase';
import { GetTaskCommentsUseCase } from '../application/use-cases/getTaskComments.useCase';
import { GetTaskHistoryUseCase } from '../application/use-cases/getTaskHistory.useCase';
//***************** DTOs **************//
import { CreateTaskDto } from '../application/dto/createTask.dto';
import { UpdateTaskDto } from '../application/dto/updateTask.dto';
import { AddTaskCommentDto } from '../application/dto/addTaskComment.dto';
//***************** services **************//
import { TaskRepository } from '../infrastructure/persistence/task.repository';
import { handleResponse, HttpCode } from '../../../helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
//***************** validators **************//
import { validateCreateTask } from '../validator/createTask.validator';
import { validateGetTask } from '../validator/getTask.validator';
import { validateGetProjectTasks } from '../validator/getProjectTasks.validator';
import { validateUpdateTask } from '../validator/updateTask.validator';
import { validateDeleteTask } from '../validator/deleteTask.validator';
import { validateAddTaskComment } from '../validator/addTaskComment.validator';
import { validateGetTaskComments } from '../validator/getTaskComments.validator';
import { validateGetTaskHistory } from '../validator/getTaskHistory.validator';

// Instancia del repositorio necesario
const taskRepository = new TaskRepository();

// Instancia de casos de uso
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const getProjectTasksUseCase = new GetProjectTasksUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const addTaskCommentUseCase = new AddTaskCommentUseCase(taskRepository);
const getTaskCommentsUseCase = new GetTaskCommentsUseCase(taskRepository);
const getTaskHistoryUseCase = new GetTaskHistoryUseCase(taskRepository);

export const TaskControllers = Router();

/**
 * Create a new task
 */
TaskControllers.post("/", validateCreateTask, asyncHandler(async (req: Request, res: Response) => {
  const { projectId, title, description, status, dueDate } = req.body;
  
  // Parse dueDate from string to Date if provided
  const parsedDueDate = dueDate ? new Date(dueDate) : null;
  
  const createTaskDto = new CreateTaskDto(projectId, title, description, status, parsedDueDate);
  const task = await createTaskUseCase.execute(createTaskDto);

  handleResponse(res, HttpCode.CREATED, task);
}));

/**
 * Get a task by ID
 */
TaskControllers.get("/:id", validateGetTask, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await getTaskUseCase.execute(id);

  handleResponse(res, HttpCode.OK, task);
}));

/**
 * Get all tasks for a project
 */
TaskControllers.get("/project/:projectId", validateGetProjectTasks, asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const tasks = await getProjectTasksUseCase.execute(projectId);

  handleResponse(res, HttpCode.OK, tasks);
}));

/**
 * Update a task
 */
TaskControllers.put("/:id", validateUpdateTask, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  const userId = req.user?.id;
  
  // Parse dueDate from string to Date if provided
  const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
  
  const updateTaskDto = new UpdateTaskDto(id, title, description, status, parsedDueDate);
  const task = await updateTaskUseCase.execute(updateTaskDto, userId);

  handleResponse(res, HttpCode.OK, task);
}));

/**
 * Delete a task
 */
TaskControllers.delete("/:id", validateDeleteTask, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await deleteTaskUseCase.execute(id);

  handleResponse(res, HttpCode.OK, { message: "Task deleted successfully" });
}));

/**
 * Add a comment to a task
 */
TaskControllers.post("/:taskId/comments", validateAddTaskComment, asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { comment } = req.body;
  const userId = req.user?.id;
  
  const addTaskCommentDto = new AddTaskCommentDto(taskId, userId, comment);
  const taskComment = await addTaskCommentUseCase.execute(addTaskCommentDto);

  handleResponse(res, HttpCode.CREATED, taskComment);
}));

/**
 * Get all comments for a task
 */
TaskControllers.get("/:taskId/comments", validateGetTaskComments, asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const comments = await getTaskCommentsUseCase.execute(taskId);

  handleResponse(res, HttpCode.OK, comments);
}));

/**
 * Get task history
 */
TaskControllers.get("/:taskId/history", validateGetTaskHistory, asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const history = await getTaskHistoryUseCase.execute(taskId);

  handleResponse(res, HttpCode.OK, history);
}));
