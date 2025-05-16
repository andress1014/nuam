import { TaskStatus } from "../../../../models/task/task.model.interface";

export class Task {
  constructor(
    public id: string,
    public projectId: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public dueDate: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id: string;
    projectId: string;
    title: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Task {
    return new Task(
      props.id,
      props.projectId,
      props.title,
      props.description || null,
      props.status || 'pending',
      props.dueDate || null,
      props.createdAt,
      props.updatedAt
    );
  }

  update(props: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: Date | null;
  }): void {
    if (props.title !== undefined) {
      this.title = props.title;
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
    if (props.status !== undefined) {
      this.status = props.status;
    }
    if (props.dueDate !== undefined) {
      this.dueDate = props.dueDate;
    }
  }
}
