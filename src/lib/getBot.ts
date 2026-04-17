import { Telegraf } from "telegraf";

let bot: Telegraf | null = null;

export function getBot() {
    if (!bot) {
        bot = new Telegraf(process.env.BOT_TOKEN!);
    }
    return bot;
}