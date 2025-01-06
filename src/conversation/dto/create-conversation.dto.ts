import { Length, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ValidateIf } from 'class-validator';
import {ConversationType} from '../enums/conversation.enum';

export class CreateConversationDto {
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(ConversationType, { message: 'Type must be either "private" or "group"' })
  type: ConversationType;

  @ValidateIf(({ type }) => type === ConversationType.GROUP)
  @Length(3, 15, { message: 'Title must be between 3 and 15 characters' })
  title?: string;

  @IsArray({ message: 'Participants must be an array' })
  @ArrayMinSize(1, { message: 'A conversation must have at least one participant' })
  participants: string[];
}