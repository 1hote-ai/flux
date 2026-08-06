import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  let token = socket.handshake.auth?.token;
  
  // Try to parse cookie if auth token is not provided
  if (!token && socket.handshake.headers.cookie) {
    const match = socket.handshake.headers.cookie.match(/(?:^|;\s*)flux_token=([^;]*)/);
    if (match) token = match[1];
  }

  if (!token) return next(new Error('Authentication error: Token missing'));

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    socket.data.userId = decoded.userId; 
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
};
