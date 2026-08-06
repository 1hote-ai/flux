import { Server, Socket } from 'socket.io';
import { authenticateSocket } from '../middlewares/socket.middleware';
import { MessageService } from '../services/message.service';
import { MessageSchema } from '../validators';

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

    socket.on('send_message', async (data: unknown) => {
      try {
        const { channelId, content } = MessageSchema.parse(data);

        const message = await MessageService.createMessage(content, channelId, userId);

        io.to(channelId).emit('receive_message', message);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          socket.emit('error', { message: error.errors[0].message });
          return;
        }
        console.error('[Socket] Ошибка при отправке сообщения:', error);
        socket.emit('error', { message: 'Не удалось отправить сообщение' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Пользователь отключился: ${userId}`);
    });
  });
};
