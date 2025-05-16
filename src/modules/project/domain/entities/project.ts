// Project domain entity - represents a project in the system
export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public createdBy: string,
    public created_at?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id?: string;
    name: string;
    description?: string | null;
    createdBy: string;
    created_at?: Date;
    updatedAt?: Date;
  }): Project {
    return new Project(
      props.id || '',
      props.name,
      props.description || null,
      props.createdBy,
      props.created_at,
      props.updatedAt
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdBy: this.createdBy,
      created_at: this.created_at,
      updatedAt: this.updatedAt
    };
  }
}
