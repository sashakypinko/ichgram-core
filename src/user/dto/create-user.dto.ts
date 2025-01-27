import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Full Name is required' })
  @Length(5, undefined, { message: 'Full Name must be at least 5 characters' })
  fullName: string;

  @IsNotEmpty({ message: 'Username is required' })
  @Length(5, undefined, { message: 'Username must be at least 5 characters' })
  username: string;

  @IsNotEmpty({message: 'Password is required'})
  password: string;
}