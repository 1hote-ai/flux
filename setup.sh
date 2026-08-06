#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# Flux — Автоматическая установка (macOS)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Использование:
#   chmod +x setup.sh
#   ./setup.sh            — полная установка + запуск
#   ./setup.sh --install  — только установка (без запуска)
#   ./setup.sh --start    — только запуск (без установки)
#   ./setup.sh --check    — только проверка зависимостей
#   ./setup.sh --stop     — остановить все процессы Flux
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Цвета и иконки ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
DIM='\033[0;90m'
NC='\033[0m'

CHECKMARK="${GREEN}✓${NC}"
CROSSMARK="${RED}✗${NC}"
ARROW="${CYAN}→${NC}"
WARN="${YELLOW}⚠${NC}"
BOLT="${PURPLE}⚡${NC}"

# ─── Переменные ──────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR"
SERVER_DIR="$SCRIPT_DIR/server"
ENV_FILE="$SERVER_DIR/.env"
LOG_DIR="$SCRIPT_DIR/.flux-logs"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_LOG="$LOG_DIR/backend.log"
PID_FILE="$LOG_DIR/flux.pids"

FRONTEND_PORT=5173
BACKEND_PORT=3000
DB_PORT=5432

DB_USER="flux"
DB_PASSWORD="flux_dev_$(openssl rand -hex 4 2>/dev/null || echo 'secret')"
DB_NAME="flux_db"

NODE_MIN_VERSION=20
REQUIRED_PORTS=($FRONTEND_PORT $BACKEND_PORT)

# ─── Утилиты ─────────────────────────────────────────────────────────────────

print_banner() {
  echo ""
  echo -e "${PURPLE}  ╔═══════════════════════════════════════════════╗${NC}"
  echo -e "${PURPLE}  ║${NC}${WHITE}          ⚡ F L U X  —  Setup             ${NC}${PURPLE}║${NC}"
  echo -e "${PURPLE}  ║${NC}${DIM}          Modern messenger for teams         ${NC}${PURPLE}║${NC}"
  echo -e "${PURPLE}  ╚═══════════════════════════════════════════════╝${NC}"
  echo ""
}

log_step() {
  echo -e "\n${BOLT} ${WHITE}$1${NC}"
  echo -e "${DIM}$(printf '%.0s─' {1..50})${NC}"
}

log_ok() {
  echo -e "  ${CHECKMARK} $1"
}

log_fail() {
  echo -e "  ${CROSSMARK} ${RED}$1${NC}"
}

log_warn() {
  echo -e "  ${WARN} ${YELLOW}$1${NC}"
}

log_info() {
  echo -e "  ${ARROW} $1"
}

die() {
  log_fail "$1"
  echo -e "\n${RED}Установка прервана.${NC}"
  exit 1
}

version_gte() {
  # Returns 0 if $1 >= $2
  printf '%s\n%s' "$2" "$1" | sort -V -C
}

# ─── Проверка зависимостей ───────────────────────────────────────────────────

check_node() {
  log_step "Проверка Node.js"

  if ! command -v node &>/dev/null; then
    log_fail "Node.js не найден"
    log_info "Установите Node.js ≥ ${NODE_MIN_VERSION}: https://nodejs.org"
    log_info "Или через Homebrew: ${CYAN}brew install node${NC}"
    return 1
  fi

  local node_version
  node_version="$(node -v | sed 's/^v//')"
  local node_major
  node_major="$(echo "$node_version" | cut -d. -f1)"

  if [ "$node_major" -lt "$NODE_MIN_VERSION" ]; then
    log_fail "Node.js v${node_version} — требуется ≥ ${NODE_MIN_VERSION}"
    log_info "Обновите: ${CYAN}brew upgrade node${NC} или скачайте с https://nodejs.org"
    return 1
  fi

  log_ok "Node.js v${node_version}"

  if ! command -v npm &>/dev/null; then
    log_fail "npm не найден"
    return 1
  fi

  local npm_version
  npm_version="$(npm -v)"
  log_ok "npm v${npm_version}"
  return 0
}

check_postgres() {
  log_step "Проверка PostgreSQL"

  # Проверяем psql
  if ! command -v psql &>/dev/null; then
    log_fail "PostgreSQL не найден"
    log_info "Установите: ${CYAN}brew install postgresql@16${NC}"
    log_info "Или скачайте: https://www.postgresql.org/download/macosx/"
    return 1
  fi

  local pg_version
  pg_version="$(psql --version | grep -oE '[0-9]+\.[0-9]+' | head -1)"
  log_ok "PostgreSQL v${pg_version} (CLI)"

  # Проверяем, запущен ли PostgreSQL
  if pg_isready -q -p "$DB_PORT" 2>/dev/null; then
    log_ok "PostgreSQL сервер запущен (порт ${DB_PORT})"
  else
    log_warn "PostgreSQL сервер не запущен"
    log_info "Попытка запуска..."

    if brew services start postgresql@16 2>/dev/null || \
       brew services start postgresql 2>/dev/null || \
       pg_ctl -D /usr/local/var/postgres start 2>/dev/null || \
       pg_ctl -D /opt/homebrew/var/postgresql@16 start 2>/dev/null; then
      sleep 2
      if pg_isready -q -p "$DB_PORT" 2>/dev/null; then
        log_ok "PostgreSQL запущен"
      else
        log_fail "Не удалось запустить PostgreSQL"
        log_info "Запустите вручную: ${CYAN}brew services start postgresql@16${NC}"
        return 1
      fi
    else
      log_fail "Не удалось запустить PostgreSQL"
      log_info "Запустите вручную: ${CYAN}brew services start postgresql@16${NC}"
      return 1
    fi
  fi

  return 0
}

check_ports() {
  log_step "Проверка портов"
  local all_free=true

  for port in "${REQUIRED_PORTS[@]}"; do
    if lsof -i ":$port" -sTCP:LISTEN &>/dev/null; then
      local pid
      pid=$(lsof -ti ":$port" -sTCP:LISTEN 2>/dev/null | head -1)
      local proc_name
      proc_name=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
      log_fail "Порт $port занят процессом ${proc_name} (PID: ${pid})"
      log_info "Освободите: ${CYAN}kill $pid${NC} или ${CYAN}lsof -ti:$port | xargs kill -9${NC}"
      all_free=false
    else
      log_ok "Порт $port свободен"
    fi
  done

  if [ "$all_free" = false ]; then
    return 1
  fi
  return 0
}

check_all() {
  local has_errors=false

  check_node || has_errors=true
  check_postgres || has_errors=true
  check_ports || has_errors=true

  if [ "$has_errors" = true ]; then
    echo ""
    log_fail "Некоторые проверки не пройдены. Устраните проблемы и запустите снова."
    return 1
  fi

  echo ""
  log_ok "Все проверки пройдены"
  return 0
}

# ─── Установка бэкенда ──────────────────────────────────────────────────────

setup_backend() {
  log_step "Настройка бэкенда (server/)"

  # Создаём директорию сервера если не существует
  if [ ! -d "$SERVER_DIR" ]; then
    log_info "Создание директории server/..."
    mkdir -p "$SERVER_DIR/src"
    mkdir -p "$SERVER_DIR/prisma"
  fi

  # package.json бэкенда
  if [ ! -f "$SERVER_DIR/package.json" ]; then
    log_info "Инициализация package.json бэкенда..."
    cat > "$SERVER_DIR/package.json" << 'PACKAGE_EOF'
{
  "name": "flux-server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.8.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "ws": "^8.18.0",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^24.13.0",
    "@types/passport": "^1.0.17",
    "@types/passport-google-oauth20": "^2.0.16",
    "@types/ws": "^8.18.0",
    "prisma": "^6.8.0",
    "tsx": "^4.19.0",
    "typescript": "~6.0.2"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
PACKAGE_EOF
    log_ok "package.json создан"
  else
    log_ok "package.json уже существует"
  fi

  # tsconfig.json бэкенда
  if [ ! -f "$SERVER_DIR/tsconfig.json" ]; then
    log_info "Создание tsconfig.json..."
    cat > "$SERVER_DIR/tsconfig.json" << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
TSCONFIG_EOF
    log_ok "tsconfig.json создан"
  fi

  # Prisma schema
  if [ ! -f "$SERVER_DIR/prisma/schema.prisma" ]; then
    log_info "Создание Prisma-схемы..."
    cat > "$SERVER_DIR/prisma/schema.prisma" << 'PRISMA_EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Пользователи ──────────────────────────────────────────

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  username      String   @unique
  displayName   String
  passwordHash  String?
  avatarUrl     String?
  status        UserStatus @default(OFFLINE)
  customStatus  String?
  googleId      String?  @unique
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Связи
  serverMembers  ServerMember[]
  messages       Message[]
  directMessages DirectMessage[]
  sessions       Session[]
  voiceStates    VoiceParticipant[]
  createdInvites Invite[]
  ownedServers   Server[]         @relation("ServerOwner")
  conversations  DMConversation[] @relation("ConversationParticipants")
}

enum UserStatus {
  ONLINE
  IDLE
  DND
  OFFLINE
}

// ─── Серверы ────────────────────────────────────────────────

model Server {
  id        String   @id @default(uuid())
  name      String
  iconUrl   String?
  ownerId   String
  createdAt DateTime @default(now())

  owner    User           @relation("ServerOwner", fields: [ownerId], references: [id])
  channels Channel[]
  members  ServerMember[]
  roles    Role[]
  invites  Invite[]
}

// ─── Каналы ─────────────────────────────────────────────────

model Channel {
  id        String      @id @default(uuid())
  serverId  String
  name      String
  type      ChannelType @default(TEXT)
  position  Int         @default(0)
  createdAt DateTime    @default(now())

  server            Server             @relation(fields: [serverId], references: [id], onDelete: Cascade)
  messages          Message[]
  voiceParticipants VoiceParticipant[]

  @@index([serverId, position])
}

enum ChannelType {
  TEXT
  VOICE
}

// ─── Сообщения ──────────────────────────────────────────────

model Message {
  id        String   @id @default(uuid())
  channelId String
  authorId  String
  content   String
  isEdited  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  channel Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
  author  User    @relation(fields: [authorId], references: [id])

  @@index([channelId, createdAt(sort: Desc)])
}

// ─── Участники сервера ──────────────────────────────────────

model ServerMember {
  id       String   @id @default(uuid())
  userId   String
  serverId String
  nickname String?
  joinedAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  server Server @relation(fields: [serverId], references: [id], onDelete: Cascade)
  roles  Role[] @relation("MemberRoles")

  @@unique([userId, serverId])
  @@index([serverId])
}

// ─── Роли ───────────────────────────────────────────────────

model Role {
  id          String  @id @default(uuid())
  serverId    String
  name        String
  color       String  @default("#99AAB5")
  permissions BigInt  @default(0)
  position    Int     @default(0)
  isDefault   Boolean @default(false)

  server  Server         @relation(fields: [serverId], references: [id], onDelete: Cascade)
  members ServerMember[] @relation("MemberRoles")

  @@index([serverId, position])
}

// ─── Приглашения ────────────────────────────────────────────

model Invite {
  id        String    @id @default(uuid())
  code      String    @unique
  serverId  String
  creatorId String
  maxUses   Int       @default(0)
  uses      Int       @default(0)
  expiresAt DateTime?
  createdAt DateTime  @default(now())

  server  Server @relation(fields: [serverId], references: [id], onDelete: Cascade)
  creator User   @relation(fields: [creatorId], references: [id])
}

// ─── Личные сообщения ───────────────────────────────────────

model DMConversation {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  participants User[]          @relation("ConversationParticipants")
  messages     DirectMessage[]
}

model DirectMessage {
  id             String   @id @default(uuid())
  conversationId String
  authorId       String
  content        String
  isEdited       Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  conversation DMConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  author       User           @relation(fields: [authorId], references: [id])

  @@index([conversationId, createdAt(sort: Desc)])
}

// ─── Голосовые комнаты ──────────────────────────────────────

model VoiceParticipant {
  id              String   @id @default(uuid())
  channelId       String
  userId          String
  isMuted         Boolean  @default(false)
  isDeafened      Boolean  @default(false)
  isSharingScreen Boolean  @default(false)
  joinedAt        DateTime @default(now())

  channel Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([channelId, userId])
}

// ─── Сессии ─────────────────────────────────────────────────

model Session {
  id           String   @id @default(uuid())
  userId       String
  refreshToken String   @unique
  userAgent    String?
  ipAddress    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
PRISMA_EOF
    log_ok "Prisma-схема создана (11 моделей)"
  else
    log_ok "Prisma-схема уже существует"
  fi

  # Точка входа сервера
  if [ ! -f "$SERVER_DIR/src/index.ts" ]; then
    log_info "Создание точки входа сервера..."
    mkdir -p "$SERVER_DIR/src"
    cat > "$SERVER_DIR/src/index.ts" << 'SERVER_EOF'
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      data: {
        status: 'ok',
        version: '0.1.0',
        uptime: process.uptime(),
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      error: { code: 'DB_UNAVAILABLE', message: 'Database connection failed' },
    });
  }
});

// ─── API placeholder ─────────────────────────────────────
app.get('/api', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Flux API',
      version: '0.1.0',
      endpoints: [
        'GET  /api/health',
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET  /api/users/@me',
        'GET  /api/servers/@me',
      ],
    },
  });
});

// ─── HTTP + WebSocket сервер ─────────────────────────────
const server = createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');

  ws.send(JSON.stringify({
    event: 'HELLO',
    data: { heartbeatInterval: 30000, version: '0.1.0' },
  }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      console.log('[WS] Received:', msg.event);

      if (msg.event === 'HEARTBEAT') {
        ws.send(JSON.stringify({ event: 'HEARTBEAT_ACK', data: {} }));
      }
    } catch {
      ws.send(JSON.stringify({
        event: 'ERROR',
        data: { code: 'INVALID_PAYLOAD', message: 'Invalid JSON' },
      }));
    }
  });

  ws.on('close', () => {
    console.log('[WS] Client disconnected');
  });
});

// ─── Запуск ──────────────────────────────────────────────
async function start() {
  try {
    await prisma.$connect();
    console.log('✓ Database connected');

    server.listen(PORT, () => {
      console.log('');
      console.log('  ⚡ Flux Server running');
      console.log(`  → REST API:   http://localhost:${PORT}/api`);
      console.log(`  → Health:     http://localhost:${PORT}/api/health`);
      console.log(`  → WebSocket:  ws://localhost:${PORT}/ws`);
      console.log('');
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});

start();
SERVER_EOF
    log_ok "Точка входа сервера создана"
  else
    log_ok "Точка входа сервера уже существует"
  fi

  # Seed файл
  if [ ! -f "$SERVER_DIR/prisma/seed.ts" ]; then
    log_info "Создание seed-файла..."
    cat > "$SERVER_DIR/prisma/seed.ts" << 'SEED_EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Seeding Flux database...');

  // Системный пользователь
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@flux.app' },
    update: {},
    create: {
      email: 'system@flux.app',
      username: 'Flux',
      displayName: 'Flux Bot',
      status: 'ONLINE',
      emailVerified: true,
    },
  });

  console.log('  ✓ System user created:', systemUser.username);

  // Тестовый сервер
  const server = await prisma.server.upsert({
    where: { id: 'seed-server-1' },
    update: {},
    create: {
      id: 'seed-server-1',
      name: 'Flux Community',
      ownerId: systemUser.id,
    },
  });

  console.log('  ✓ Test server created:', server.name);

  // Роль @everyone
  const everyoneRole = await prisma.role.upsert({
    where: { id: 'seed-role-everyone' },
    update: {},
    create: {
      id: 'seed-role-everyone',
      serverId: server.id,
      name: '@everyone',
      permissions: BigInt(0x06C1),
      position: 0,
      isDefault: true,
    },
  });

  console.log('  ✓ @everyone role created (permissions: 0x06C1)');

  // Каналы
  const channels = [
    { id: 'seed-ch-1', name: 'общий', type: 'TEXT' as const, position: 0 },
    { id: 'seed-ch-2', name: 'команды', type: 'TEXT' as const, position: 1 },
    { id: 'seed-ch-3', name: 'идеи', type: 'TEXT' as const, position: 2 },
    { id: 'seed-ch-4', name: 'Общий', type: 'VOICE' as const, position: 3 },
    { id: 'seed-ch-5', name: 'Музыка', type: 'VOICE' as const, position: 4 },
  ];

  for (const ch of channels) {
    await prisma.channel.upsert({
      where: { id: ch.id },
      update: {},
      create: {
        id: ch.id,
        serverId: server.id,
        name: ch.name,
        type: ch.type,
        position: ch.position,
      },
    });
  }

  console.log(`  ✓ ${channels.length} channels created`);

  // Участник
  await prisma.serverMember.upsert({
    where: {
      userId_serverId: {
        userId: systemUser.id,
        serverId: server.id,
      },
    },
    update: {},
    create: {
      userId: systemUser.id,
      serverId: server.id,
      roles: { connect: { id: everyoneRole.id } },
    },
  });

  console.log('  ✓ Server member linked');

  // Приветственное сообщение
  await prisma.message.create({
    data: {
      channelId: 'seed-ch-1',
      authorId: systemUser.id,
      content: 'Добро пожаловать в Flux! 🚀',
    },
  });

  console.log('  ✓ Welcome message created');
  console.log('');
  console.log('⚡ Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEED_EOF
    log_ok "Seed-файл создан"
  fi

  # .env файл
  if [ ! -f "$ENV_FILE" ]; then
    log_info "Создание .env..."
    cat > "$ENV_FILE" << ENV_EOF
# ─── Database ───────────────
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}

# ─── Server ────────────────
PORT=${BACKEND_PORT}
NODE_ENV=development

# ─── Auth ───────────────────
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo 'dev-jwt-secret-change-in-production')
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# ─── Google OAuth ───────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:${BACKEND_PORT}/api/auth/google/callback

# ─── Client ────────────────
CLIENT_URL=http://localhost:${FRONTEND_PORT}
ENV_EOF
    log_ok ".env создан"
  else
    log_ok ".env уже существует"
    # Читаем существующие значения из .env
    if grep -q "DATABASE_URL" "$ENV_FILE"; then
      DB_USER=$(grep "DATABASE_URL" "$ENV_FILE" | sed 's/.*:\/\/\([^:]*\):.*/\1/')
      DB_PASSWORD=$(grep "DATABASE_URL" "$ENV_FILE" | sed 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/')
      DB_NAME=$(grep "DATABASE_URL" "$ENV_FILE" | sed 's/.*\/\([^?]*\).*/\1/')
    fi
  fi
}

# ─── Установка npm-зависимостей ──────────────────────────────────────────────

install_dependencies() {
  log_step "Установка npm-зависимостей"

  # Фронтенд
  log_info "Фронтенд (${FRONTEND_DIR})..."
  cd "$FRONTEND_DIR"
  if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    npm install --silent 2>&1 | tail -1
    log_ok "Фронтенд: зависимости установлены"
  else
    log_ok "Фронтенд: зависимости актуальны"
  fi

  # Бэкенд
  log_info "Бэкенд (${SERVER_DIR})..."
  cd "$SERVER_DIR"
  if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    npm install --silent 2>&1 | tail -1
    log_ok "Бэкенд: зависимости установлены"
  else
    log_ok "Бэкенд: зависимости актуальны"
  fi

  cd "$SCRIPT_DIR"
}

# ─── Настройка базы данных ───────────────────────────────────────────────────

setup_database() {
  log_step "Настройка базы данных"

  # Проверяем существует ли пользователь
  if psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" postgres 2>/dev/null | grep -q 1; then
    log_ok "Пользователь '${DB_USER}' существует"
  else
    log_info "Создание пользователя '${DB_USER}'..."
    psql postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}' CREATEDB;" 2>/dev/null || \
      createuser -s "${DB_USER}" 2>/dev/null || \
      die "Не удалось создать пользователя PostgreSQL '${DB_USER}'"
    log_ok "Пользователь '${DB_USER}' создан"
  fi

  # Проверяем существует ли БД
  if psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" postgres 2>/dev/null | grep -q 1; then
    log_ok "База данных '${DB_NAME}' существует"
  else
    log_info "Создание базы данных '${DB_NAME}'..."
    createdb -O "${DB_USER}" "${DB_NAME}" 2>/dev/null || \
      psql postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || \
      die "Не удалось создать базу данных '${DB_NAME}'"
    log_ok "База данных '${DB_NAME}' создана"
  fi

  # Prisma
  log_info "Генерация Prisma Client..."
  cd "$SERVER_DIR"
  npx prisma generate --schema=prisma/schema.prisma 2>&1 | grep -E "Generated|generated" || true
  log_ok "Prisma Client сгенерирован"

  log_info "Применение миграций..."
  npx prisma db push --accept-data-loss 2>&1 | grep -E "database|synced|applied" || true
  log_ok "Схема БД синхронизирована"

  # Seed
  log_info "Заполнение начальными данными..."
  npx prisma db seed 2>&1 | grep -E "✓|completed|Seed" || true
  log_ok "Начальные данные загружены"

  cd "$SCRIPT_DIR"
}

# ─── Запуск приложения ───────────────────────────────────────────────────────

start_app() {
  log_step "Запуск Flux"

  mkdir -p "$LOG_DIR"
  > "$PID_FILE"

  # Бэкенд
  log_info "Запуск бэкенда на порту ${BACKEND_PORT}..."
  cd "$SERVER_DIR"
  npm run dev > "$BACKEND_LOG" 2>&1 &
  local backend_pid=$!
  echo "backend:$backend_pid" >> "$PID_FILE"
  cd "$SCRIPT_DIR"

  # Ждём запуска бэкенда
  local retries=0
  while [ $retries -lt 15 ]; do
    if curl -s "http://localhost:${BACKEND_PORT}/api/health" >/dev/null 2>&1; then
      break
    fi
    sleep 1
    retries=$((retries + 1))
  done

  if [ $retries -lt 15 ]; then
    log_ok "Бэкенд запущен (PID: ${backend_pid})"
  else
    log_warn "Бэкенд запускается... (PID: ${backend_pid})"
    log_info "Лог: ${CYAN}tail -f ${BACKEND_LOG}${NC}"
  fi

  # Фронтенд
  log_info "Запуск фронтенда на порту ${FRONTEND_PORT}..."
  cd "$FRONTEND_DIR"
  npm run dev > "$FRONTEND_LOG" 2>&1 &
  local frontend_pid=$!
  echo "frontend:$frontend_pid" >> "$PID_FILE"
  cd "$SCRIPT_DIR"

  # Ждём запуска фронтенда
  retries=0
  while [ $retries -lt 10 ]; do
    if curl -s "http://localhost:${FRONTEND_PORT}" >/dev/null 2>&1; then
      break
    fi
    sleep 1
    retries=$((retries + 1))
  done

  if [ $retries -lt 10 ]; then
    log_ok "Фронтенд запущен (PID: ${frontend_pid})"
  else
    log_warn "Фронтенд запускается... (PID: ${frontend_pid})"
    log_info "Лог: ${CYAN}tail -f ${FRONTEND_LOG}${NC}"
  fi

  # Итог
  echo ""
  echo -e "${GREEN}  ╔═══════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}  ║${NC}${WHITE}          ⚡ Flux запущен!                    ${NC}${GREEN}║${NC}"
  echo -e "${GREEN}  ╠═══════════════════════════════════════════════╣${NC}"
  echo -e "${GREEN}  ║${NC}                                               ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  Фронтенд:  ${CYAN}http://localhost:${FRONTEND_PORT}${NC}         ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  API:        ${CYAN}http://localhost:${BACKEND_PORT}/api${NC}       ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  WebSocket:  ${CYAN}ws://localhost:${BACKEND_PORT}/ws${NC}          ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  Health:     ${CYAN}http://localhost:${BACKEND_PORT}/api/health${NC} ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}                                               ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  Остановить: ${YELLOW}./setup.sh --stop${NC}              ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}  Логи:       ${DIM}.flux-logs/${NC}                     ${GREEN}║${NC}"
  echo -e "${GREEN}  ║${NC}                                               ${GREEN}║${NC}"
  echo -e "${GREEN}  ╚═══════════════════════════════════════════════╝${NC}"
  echo ""
}

# ─── Остановка ───────────────────────────────────────────────────────────────

stop_app() {
  log_step "Остановка Flux"

  if [ -f "$PID_FILE" ]; then
    while IFS=: read -r name pid; do
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null
        log_ok "Остановлен $name (PID: $pid)"
      else
        log_info "$name уже остановлен (PID: $pid)"
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi

  # Убедимся, что порты свободны
  for port in "${REQUIRED_PORTS[@]}"; do
    local pid
    pid=$(lsof -ti ":$port" -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "$pid" ]; then
      kill "$pid" 2>/dev/null || true
      log_ok "Освобождён порт $port (PID: $pid)"
    fi
  done

  log_ok "Flux остановлен"
}

# ─── Полная установка ────────────────────────────────────────────────────────

full_setup() {
  check_all || exit 1
  setup_backend
  install_dependencies
  setup_database
  start_app
}

# ─── CLI ─────────────────────────────────────────────────────────────────────

print_banner

case "${1:-}" in
  --check)
    check_all
    ;;
  --install)
    check_all || exit 1
    setup_backend
    install_dependencies
    setup_database
    log_ok "Установка завершена. Запустите: ${CYAN}./setup.sh --start${NC}"
    ;;
  --start)
    check_ports || exit 1
    start_app
    ;;
  --stop)
    stop_app
    ;;
  --help|-h)
    echo "Использование:"
    echo "  ./setup.sh            Полная установка + запуск"
    echo "  ./setup.sh --install  Только установка (без запуска)"
    echo "  ./setup.sh --start    Только запуск"
    echo "  ./setup.sh --stop     Остановить Flux"
    echo "  ./setup.sh --check    Проверка зависимостей"
    echo "  ./setup.sh --help     Это сообщение"
    ;;
  *)
    full_setup
    ;;
esac
