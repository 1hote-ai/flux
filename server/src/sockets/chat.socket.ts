import { Server, Socket } from 'socket.io';
import { prisma } from '../utils/prisma';
import { authenticateSocket } from '../middlewares/socket.middleware';

export const setupChatSockets = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`[Socket] Пользователь подключен: ${userId} (Socket ID: ${socket.id})`);

    socket.on('join_channel', (channelId: string) => {
      socket.join(channelId);
      console.log(`[Socket] Пользователь ${userId} присоединился к каналу ${channelId}`);
    });

    socket.on('leave_channel', (channelId: string) => {
      socket.leave(channelId);
      console.log(`[Socket] Пользователь ${userId} покинул канал ${channelId}`);
    });

    socket.on('send_message', async (data: { channelId: string; content: string }) => {
      try {
        const { channelId, content } = data;

        const message = await prisma.message.create({
          data: {
            content,
            channelId,
            authorId: userId,
          },
          include: {
            author: { select: { id: true, username: true, email: true } } 
          }
        });

        io.to(channelId).emit('receive_message', message);
      } catch (error) {
        console.error('[Socket] Ошибка при отправке сообщения:', error);
        socket.emit('error', { message: 'Не удалось отправить сообщение' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Пользователь отключился: ${userId}`);
    });
  });
};
