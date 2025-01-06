import {BadRequestException, ForbiddenException, Injectable} from 'light-kite';
import {CreateConversationDto} from './dto/create-conversation.dto';
import {Conversation, IConversation} from './conversation.schema';
import {ConversationParticipantRole, ConversationType} from './enums/conversation.enum';
import mongoose from 'mongoose';
import EntityService from '../core/services/entity.service';

@Injectable()
class ConversationService extends EntityService<IConversation> {
  constructor() {
    super(Conversation);
  }
  
  async get(userId: string): Promise<IConversation[]> {
    return Conversation.aggregate([
      {
        $match: {
          'participants.userId': new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'messages',
          let: {conversationId: '$_id'},
          pipeline: [
            {$match: {$expr: {$eq: ['$conversationId', '$$conversationId']}}},
            {$sort: {sentAt: -1}},
            {$limit: 1},
          ],
          as: 'lastMessage',
        },
      },
      {
        $unwind: {
          path: '$lastMessage',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'messages',
          let: {conversationId: '$_id'},
          pipeline: [
            {$match: {$expr: {$eq: ['$conversationId', '$$conversationId']}}},
            {
              $match: {
                readBy: {$not: {$in: [new mongoose.Types.ObjectId(userId)]}},
              },
            },
            {$limit: 1},
          ],
          as: 'unreadMessages',
        },
      },
      {
        $addFields: {
          hasUnread: {$gt: [{$size: '$unreadMessages'}, 0]},
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'participantsDetails',
        },
      },
      {
        $addFields: {
          participants: {
            $map: {
              input: '$participants',
              as: 'participant',
              in: {
                role: '$$participant.role',
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$participantsDetails',
                        as: 'user',
                        cond: {$eq: ['$$user._id', '$$participant.userId']},
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $unset: 'participantsDetails',
      },
      {
        $sort: {
          'lastMessage.sentAt': -1,
        },
      },
    ]);
  }

  async getById(id: string): Promise<IConversation> {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    return conversation;
  }

  findById(id: string): Promise<IConversation | null> {
    return Conversation.findById(id);
  }

  async create(userId: string, data: CreateConversationDto): Promise<IConversation> {
    if (data.type === ConversationType.PRIVATE) {
      const existingConversation = await Conversation.findOne({
        type: ConversationType.PRIVATE,
        participants: {
          $all: [
            {$elemMatch: {userId: data.participants[0]}},
            {$elemMatch: {userId}},
          ],
        },
      });

      if (existingConversation) {
        return existingConversation.populate('participants.user');
      }
    }

    const conversation = new Conversation({
      ...data,
      participants: [
        ...data.participants.map(id => ({
          userId: id,
          role: ConversationParticipantRole.MEMBER,
        })),
        {
          userId,
          role: ConversationParticipantRole.ADMIN,
        },
      ],
    });

    await conversation.save();
    return conversation.populate('participants.user');
  }

  async removeParticipant(conversationId: string, userId: string): Promise<IConversation> {
    const conversation = await this.getById(conversationId);
    
    await Conversation.updateOne({_id: conversationId}, {
      participants: conversation.participants.filter((p) => !p.userId.equals(userId))
    });
    
    return conversation;
  }

  async delete(conversationId: string, userId: string): Promise<IConversation> {
    const conversation = await this.getById(conversationId);

    const member = conversation.participants.find((p) => p.userId.equals(userId));

    if (!member) {
      throw new ForbiddenException('You are not a member of this conversation');
    }

    if (member.role !== ConversationParticipantRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete this conversation');
    }

    await Conversation.deleteOne({_id: conversationId});
    return conversation;
  }

}

export default ConversationService;