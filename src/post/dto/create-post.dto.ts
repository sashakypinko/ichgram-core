import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostDto {
  media: File;
  
  @IsNotEmpty()
  @Length(1, 512, {message: 'Post content must be between 1 and 512 characters'})
  content: string;
}