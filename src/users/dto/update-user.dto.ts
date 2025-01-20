import { IsOptional, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  province?: string;

  @IsOptional()
  district?: string;

  @IsOptional()
  ward?: string;
}
