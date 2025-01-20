import { IsEmail, IsNotEmpty } from 'class-validator';
export class GetUserDto {
  id: string;
  email: string;
  fullname: string;
  password: string;
  avatar: string;
  phone?: string;
}
