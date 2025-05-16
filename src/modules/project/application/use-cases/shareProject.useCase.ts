import { AppError, HttpCode } from "../../../../helpers";
import { ShareProjectDto } from "../dto/shareProject.dto";
import { ProjectSharingService } from "../../services/projectSharing.service";

export class ShareProjectUseCase {
  constructor(private readonly projectSharingService: ProjectSharingService) {}
  
  async execute(shareProjectDto: ShareProjectDto): Promise<void> {
    try {
      await this.projectSharingService.shareProject(
        shareProjectDto.projectId,
        shareProjectDto.userIds,
        shareProjectDto.role,
        shareProjectDto.sharedByUserId
      );
    } catch (error) {
      console.error("Error sharing project:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error sharing project',
        detailsError: error
      });
    }
  }
}
