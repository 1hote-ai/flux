import { prisma } from '../utils/prisma';

export class MessageService {
  static async createMessage(content: string, channelId: string, authorId: string) {
    return prisma.message.create({
      data: {
        content,
        channelId,
        authorId,
      },
      include: {
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }
}
