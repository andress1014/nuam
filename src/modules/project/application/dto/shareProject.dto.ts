export class ShareProjectDto {
  constructor(
    public projectId: string,
    public userIds: string[],
    public role: 'owner' | 'editor' | 'viewer',
    public sharedByUserId: string
  ) {}
}
