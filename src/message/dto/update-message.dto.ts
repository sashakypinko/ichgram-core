import {Length, IsNotEmpty} from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty({message: 'Message content is required'})
  @Length(1, 512, {message: 'Message content must be between 1 and 512 characters'})
  content: string;
}