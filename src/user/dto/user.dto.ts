import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpadateUserDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    last_name: string;
}
