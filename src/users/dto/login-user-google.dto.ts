import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginUserGoogleDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  googleId: string;
  @IsNotEmpty()
  password: string;
  avatar: string;
}
