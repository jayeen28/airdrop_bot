import dotenv from 'dotenv';
import { Telegraf } from "telegraf";
import registerCommands from './commands';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('Add bot token in environment');

const bot = new Telegraf(BOT_TOKEN);

// Startup logging
console.log('🤖 Bot starting...');
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

registerCommands(bot);

bot.launch();

let isShuttingDown = false;
async function shutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n🛑 ${signal} received, shutting down gracefully...`);

    try {
        await bot.stop(signal);
        console.log('✅ Bot stopped');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1);
    }
}

// Handle all relevant signals
process.once('SIGINT', () => shutdown('SIGINT'));      // Ctrl+C
process.once('SIGTERM', () => shutdown('SIGTERM'));    // kill, docker stop
process.once('SIGUSR2', () => shutdown('SIGUSR2'));    // nodemon