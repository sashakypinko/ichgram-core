import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {message: 'Invalid email format'})
  email: string;

  @IsNotEmpty({message: 'Full Name is required'})
  fullName: string;

  @IsNotEmpty({message: 'Username is required'})
  username: string;

  @IsNotEmpty({message: 'Password is required'})
  password: string;
}