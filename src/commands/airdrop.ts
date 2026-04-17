import { Telegraf } from "telegraf";
import { redis } from "../lib/redis";
import { AIRDROP_COMMAND_REPLY } from "../lib/replies/airdrop.reply";

export default function airdropCommand(bot: Telegraf) {
    bot.command('airdrop', async (ctx) => {
        await redis.set(`airdrop_waiting:${ctx.from.id}`, "1", "EX", 60);

        await ctx.reply(AIRDROP_COMMAND_REPLY);
    });
}