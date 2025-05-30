import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UserLoginDto {
    @IsString()
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
}

export class resendConfirmationMailDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class resetPasswordDto {

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class changePasswordDto {

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
} 