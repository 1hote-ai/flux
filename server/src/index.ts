import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupChatSockets } from './sockets/chat.socket';
import { register, login } from './controllers/auth.controller';
import { authenticateApi } from './middlewares/auth.middleware';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/.*\.trycloudflare\.com$/
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Example protected route
app.get('/api/users/me', authenticateApi, (req: any, res) => {
  res.json({ userId: req.user.userId });
});

setupChatSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Server] Сервер Flux запущен на порту ${PORT}`);
});
