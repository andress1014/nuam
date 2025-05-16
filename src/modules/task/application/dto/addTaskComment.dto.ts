export class AddTaskCommentDto {
  constructor(
    public taskId: string,
    public userId: string,
    public comment: string
  ) {}
}
