// Data Transfer Object for project responses
export class ProjectDto {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public createdBy: string,
    public created_at?: Date,
    public updatedAt?: Date
  ) {}

  static fromEntity(entity: any): ProjectDto {
    return new ProjectDto(
      entity.id,
      entity.name,
      entity.description,
      entity.createdBy,
      entity.created_at,
      entity.updatedAt
    );
  }
}
