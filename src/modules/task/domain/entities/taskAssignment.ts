export class TaskAssignment {
  constructor(
    public id: string,
    public taskId: string,
    public userId: string,
    public assignedAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id: string;
    taskId: string;
    userId: string;
    assignedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): TaskAssignment {
    return new TaskAssignment(
      props.id,
      props.taskId,
      props.userId,
      props.assignedAt || new Date(),
      props.createdAt,
      props.updatedAt
    );
  }
}
