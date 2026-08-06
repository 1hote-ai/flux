import { z } from 'zod';

export const MessageSchema = z.object({
  channelId: z.string().uuid("Некорректный ID канала"),
  content: z.string()
    .min(1, "Сообщение не может быть пустым")
    .max(2000, "Сообщение слишком длинное"),
});

export const AuthSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
  username: z.string().min(2, "Имя пользователя должно быть не короче 2 символов").optional(),
});
