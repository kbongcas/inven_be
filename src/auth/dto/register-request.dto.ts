import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterRequestDto{
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
