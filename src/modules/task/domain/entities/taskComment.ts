export class TaskComment {
  constructor(
    public id: string,
    public taskId: string,
    public userId: string,
    public comment: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id: string;
    taskId: string;
    userId: string;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): TaskComment {
    return new TaskComment(
      props.id,
      props.taskId,
      props.userId,
      props.comment,
      props.createdAt,
      props.updatedAt
    );
  }
}
