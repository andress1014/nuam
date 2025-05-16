export class ProjectMember {
  constructor(
    public id: string,
    public projectId: string,
    public userId: string,
    public role: 'owner' | 'editor' | 'viewer',
    public addedAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id: string;
    projectId: string;
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    addedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): ProjectMember {
    return new ProjectMember(
      props.id,
      props.projectId,
      props.userId,
      props.role,
      props.addedAt || new Date(),
      props.createdAt,
      props.updatedAt
    );
  }
}
