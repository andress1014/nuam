export class UpdateTaskDto {
  constructor(
    public id: string,
    public title?: string,
    public description?: string | null,
    public status?: string,
    public dueDate?: Date | null
  ) {}
}
