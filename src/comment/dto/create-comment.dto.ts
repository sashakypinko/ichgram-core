import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  //TODO add Post existing validation
  @IsNotEmpty({message: 'Post ID is required'})
  post: string;
  
  @IsNotEmpty()
  @Length(1, 256, {message: 'Comment must be between 1 and 256 characters'})
  text: string;
}