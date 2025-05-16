// Data Transfer Object for user profile data
export class UserProfileDto {  constructor(
    public id: string,
    public name: string,
    public email: string,
    public created_at?: Date,
    public updatedAt?: Date
  ) {}
  static fromEntity(entity: any): UserProfileDto {
    return new UserProfileDto(
      entity.id,
      entity.name,
      entity.email,
      entity.created_at,
      entity.updatedAt
    );
  }
}
