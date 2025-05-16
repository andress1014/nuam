// Data Transfer Object for user registration
export class RegisterUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}
}
