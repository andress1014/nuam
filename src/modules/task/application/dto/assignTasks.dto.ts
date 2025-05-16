export interface TaskAssignmentItem {
  taskId: string;
  userId: string;
}

export class AssignTasksDto {
  constructor(
    public projectId: string,
    public assignments: TaskAssignmentItem[],
    public assignedByUserId: string
  ) {}
}
