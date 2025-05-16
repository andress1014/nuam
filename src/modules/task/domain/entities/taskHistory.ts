export class TaskHistory {
  constructor(
    public id: string,
    public taskId: string,
    public changedBy: string,
    public changeType: string,
    public oldValue: string | null,
    public newValue: string | null,
    public changedAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id: string;
    taskId: string;
    changedBy: string;
    changeType: string;
    oldValue?: string | null;
    newValue?: string | null;
    changedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): TaskHistory {
    return new TaskHistory(
      props.id,
      props.taskId,
      props.changedBy,
      props.changeType,
      props.oldValue || null,
      props.newValue || null,
      props.changedAt || new Date(),
      props.createdAt,
      props.updatedAt
    );
  }
}
