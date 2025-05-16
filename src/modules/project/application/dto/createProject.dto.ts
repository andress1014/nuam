// Data Transfer Object for project creation
export class CreateProjectDto {
  constructor(
    public name: string,
    public userId: string,  // El ID del usuario que crea el proyecto
    public description?: string | null
  ) {}
}
