import dotenv from 'dotenv';
import { Telegraf } from "telegraf";
import registerCommands from './commands';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('Add bot token in environment');

const bot = new Telegraf(BOT_TOKEN);

registerCommands(bot);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))