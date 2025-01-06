import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @Length(1, 256, { message: 'Comment must be between 1 and 256 characters' })
  text: string;
}