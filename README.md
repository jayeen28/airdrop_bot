# Geo Drop Bot

A Telegram bot for sharing and receiving location-based airdrops. Users can send a drop message with text, photo, video, or voice content, and the bot can also listen for nearby drops based on the last shared location.

## Features

- `/start` — register user and prompt for location sharing
- `/help` — show available commands and usage guidance
- `/listen` — enable listening for nearby geo-drops
- `/stop` — stop listening for nearby drops
- `/airdrop` — create a new drop message by sending content after the command
- Supports one-time location sharing with Telegram and live location requests
- Uses MongoDB, Redis, and RabbitMQ for persistence, queueing, and state management

## How it works

1. The bot starts with `src/bot.ts`.
2. It connects to MongoDB, Redis, and launches a worker for background tasks.
3. Commands are registered from `src/commands`.
4. Message listeners process user replies and handle pending airdrop content.
5. Geo-based airdrop discovery is driven by user location and active listening state.

## Commands

- `/start` — initialize the bot and show location sharing options
- `/help` — display help and command list
- `/listen` — start receiving nearby airdrop notifications
- `/stop` — stop receiving nearby notifications
- `/airdrop` — begin creating a new airdrop; send content within 60 seconds

## Project structure

- `src/bot.ts` — main entrypoint and startup logic
- `src/commands/` — command handlers
- `src/listeners/` — update and message listeners
- `src/services/` — business logic for user, location, listen, message, and airdrop flows
- `src/lib/` — helper utilities, Redis connector, replies, and models
- `src/worker/` — background worker setup

## Requirements

- Node.js (recommended v18+)
- MongoDB
- Redis
- RabbitMQ
- Telegram bot token

## Environment variables

Create a `.env` file in the project root with:

```env
BOT_TOKEN=your-telegram-bot-token
MONGODB_URI=mongodb://localhost:27017/geo_drop_bot

RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

REDIS_PORT=6379
```

## Local development

Install dependencies:

```bash
pnpm install
```

Start services with Docker Compose:

```bash
docker compose up -d
```

Run the bot:

```bash
pnpm start
```

## Notes

- The bot uses Redis to track pending airdrop state for one minute after `/airdrop`.
- Location sharing is required before `/listen` can activate.
- The project currently uses polling mode via Telegraf.

## License

This project does not include a license file. Add one if you want to share or publish it.
