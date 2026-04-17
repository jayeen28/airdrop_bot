import dotenv from 'dotenv';
import { Telegraf } from "telegraf";
import mongoose from 'mongoose';
import registerCommands from './commands';
import registerListeners from './listeners';
import worker from './worker/worker';
import { connectRedis } from './lib/redis';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const MONGODB_URI = process.env.MONGODB_URI!;

if (!BOT_TOKEN) throw new Error('Add BOT_TOKEN to environment');
if (!MONGODB_URI) throw new Error('Add MONGODB_URI to environment');

async function connectDatabase(): Promise<void> {
    console.log('🔗 Connecting to MongoDB...');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

    } catch (err: any) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
}

async function startBot() {
    // Connect DB first - bot won't start if this fails
    await connectDatabase();
    await worker();
    await connectRedis();

    const bot = new Telegraf(BOT_TOKEN);

    console.log('🤖 Bot starting...');
    console.log(`📅 ${new Date().toLocaleString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

    registerListeners(bot);
    registerCommands(bot);

    // Launch without awaiting (blocks in polling mode)
    bot.launch().catch(console.error);

    // Verify bot connection
    setTimeout(async () => {
        try {
            const me = await bot.telegram.getMe();
            console.log('✅ Bot is running!');
            console.log(`🤖 @${me.username} (${me.first_name})`);
        } catch (err) {
            console.error('❌ Failed to verify bot connection');
        }
    }, 1000);

    // Graceful shutdown handler
    let isShuttingDown = false;
    async function shutdown(signal: string) {
        if (isShuttingDown) return;
        isShuttingDown = true;

        console.log(`\n🛑 ${signal} received, shutting down gracefully...`);

        try {
            await bot.stop(signal);
            await mongoose.connection.close();
            console.log('✅ Bot and MongoDB stopped');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during shutdown:', err);
            process.exit(1);
        }
    }

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGUSR2', () => shutdown('SIGUSR2'));
}

startBot().catch((err) => {
    console.error('💥 Fatal error during startup:', err.message);
    process.exit(1);
});