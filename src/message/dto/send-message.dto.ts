import {Length, IsNotEmpty, IsOptional} from 'class-validator';

export class SendMessageDto {
  //TODO add Conversation existing validation
  @IsNotEmpty({message: 'Conversation ID is required'})
  conversationId: string;

  @IsOptional()
  @Length(1, 512, {message: 'Message content must be between 1 and 512 characters'})
  content: string;

  @IsOptional()
  media: File;
}