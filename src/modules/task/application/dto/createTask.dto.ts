export class CreateTaskDto {
  constructor(
    public projectId: string,
    public title: string,
    public description?: string | null,
    public status?: string,
    public dueDate?: Date | null
  ) {}
}
