import {IsNotEmpty, Length} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({message: 'Full Name is required'})
  fullName: string;

  @IsNotEmpty({message: 'Username is required'})
  username: string;

  @Length(0, 256)
  about: string;
  
  avatar?: File | string;
}