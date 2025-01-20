import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Email không được để trống nếu không có số điện thoại.',
  })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ.' })
  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: 'Họ và tên không được để trống.' })
  fullname: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}
