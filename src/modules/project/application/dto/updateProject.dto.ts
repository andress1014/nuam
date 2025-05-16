// Data Transfer Object for project update
export class UpdateProjectDto {
  constructor(
    public id: string,
    public name?: string,
    public description?: string | null
  ) {}
}
