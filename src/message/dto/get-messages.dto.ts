import {IsNotEmpty} from 'class-validator';

export class GetMessagesDto {
  @IsNotEmpty({message: 'Conversation ID is required'})
  conversationId: string;
  offset?: number
}