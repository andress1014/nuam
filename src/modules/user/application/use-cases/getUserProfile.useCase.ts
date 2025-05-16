import { AppError, HttpCode } from "../../../../helpers";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import { UserProfileDto } from "../dto/userProfile.dto";

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
      if (!user) {
      throw new AppError({
        status: HttpCode.NOT_FOUND,
        message: 'User not found'
      });
    }

    return UserProfileDto.fromEntity(user);
  }
}
