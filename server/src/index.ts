import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { setupChatSockets } from './sockets/chat.socket';
import { register, login, logout } from './controllers/auth.controller';
import { authenticateApi } from './middlewares/auth.middleware';
import { config } from './config';

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/.*\.trycloudflare\.com$/,
  config.clientUrl
];

// Security: Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window`
  message: { error: 'Слишком много попыток входа, пожалуйста, повторите позже.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: { error: 'Слишком много запросов.' },
});

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
app.use(cookieParser());

// Routes
app.use('/api/auth', authLimiter);
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

app.use('/api', apiLimiter);
app.get('/api/users/me', authenticateApi, (req: any, res) => {
  res.json({ userId: req.user.userId });
});

setupChatSockets(io);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

server.listen(config.port, () => {
  console.log(`[Server] Сервер Flux запущен на порту ${config.port}`);
});
