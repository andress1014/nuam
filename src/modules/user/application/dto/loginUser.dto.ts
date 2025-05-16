// Data Transfer Object for user login
export class LoginUserDto {
  constructor(
    public email: string,
    public password: string
  ) {}
}
