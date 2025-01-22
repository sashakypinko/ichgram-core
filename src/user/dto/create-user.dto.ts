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

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, undefined, { message: 'Password must be at least 8 characters' })
  @Matches(/(?=(.*[A-Z]){2})/, {
    message: 'Password must contain at least 2 uppercase letters.',
  })
  @Matches(/(?=(.*[a-z]){2})/, {
    message: 'Password must contain at least 2 lowercase letters.',
  })
  @Matches(/(?=(.*\d){1})/, {
    message: 'Password must contain at least 1 number.',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least 1 special character (@, $, !, %, *, ?, &).',
  })
  @Matches(/^[\w@$!%*?&]+$/, {
    message: 'Password can only contain letters, numbers, and @$!%*?& symbols.',
  })
  password: string;
}