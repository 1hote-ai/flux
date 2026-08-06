import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_flux_key';

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
  
  if (!token) return next(new Error('Authentication error: Token missing'));

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    socket.data.userId = decoded.userId; 
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
};
