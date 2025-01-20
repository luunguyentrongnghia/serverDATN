import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({
    message: 'Email không được để trống nếu không có số điện thoại.',
  })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ.' })
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  password: string;
}
