import mongoose from 'mongoose';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from 'light-kite';
import {IMessage, Message} from './message.schema';
import {SendMessageDto} from './dto/send-message.dto';
import {UpdateMessageDto} from './dto/update-message.dto';
import {Conversation, IConversation} from '../conversation/conversation.schema';
import EntityService from '../core/services/entity.service';

@Injectable()
class MessageService extends EntityService<IMessage> {
  constructor() {
    super(Message);
  }

  async findById(id: string): Promise<IMessage | null> {
    return Message.findById(id);
  }

  async getById(id: string): Promise<IMessage> {
    const message: IMessage | null = await Message.findById(id);
    if (!message) throw new BadRequestException('Message not found');

    return message;
  }
  
  async getByConversationId(userId: string, conversationId: string, offset: number): Promise<IMessage[]> {
    const conversation: IConversation | null = await Conversation
      .findOne({ _id: conversationId, 'participants.userId': userId });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return Message.find({ conversationId })
      .sort({ sentAt: -1 })
      .skip(offset)
      .limit(20)
      .populate(['sender', 'repliedMessage', 'forwardedMessage']);
  }

  async send(userId: string, data: SendMessageDto): Promise<IMessage> {
    const message: IMessage = new Message({
      ...data,
      senderId: userId,
      readBy: [userId],
    });

    await message.save();
    return message.populate(['sender', 'repliedMessage', 'forwardedMessage']);
  }

  async update(userId: string, messageId: string, data: UpdateMessageDto): Promise<IMessage> {
    const message = await this.getById(messageId);
    
    if (!message.senderId.equals(userId)) {
      throw new ForbiddenException('User is not authorized to update this message');
    }

    message.content = data.content;
    message.edited = true;

    await message.save();
    return message.populate(['sender', 'repliedMessage', 'forwardedMessage']);
  }

  async delete(userId: string, messageId: string): Promise<IMessage> {
    const message = await this.getById(messageId);
    
    if (!message.senderId.equals(userId)) {
      throw new ForbiddenException('User is not authorized to delete this message');
    }

    await Message.deleteOne({_id: messageId});
    return message;
  }

  async markAsRead(userId: string, messageId: string): Promise<IMessage> {
    const message = await this.getById(messageId);
    
    if (message.readBy.find((readById) => readById.equals(userId))) {
      throw new BadRequestException('Message already marked as read');
    }
    
    message.readBy.push(new mongoose.Types.ObjectId(userId));

    await message.save();
    return message.populate(['sender', 'repliedMessage', 'forwardedMessage']);
  }
}

export default MessageService;