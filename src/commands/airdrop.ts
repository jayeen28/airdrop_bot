import { Telegraf } from "telegraf";
import { redis } from "../lib/redis";
import { AIRDROP_COMMAND_REPLY } from "../lib/replies/airdrop.reply";
import { hasLocation } from "../services/user/user";
import { NO_LOCATION } from "../lib/replies/location.reply";

export default function airdropCommand(bot: Telegraf) {
    bot.command('airdrop', async (ctx) => {
        const tg_id = ctx.message.from.id;

        if (await hasLocation(tg_id)) {
            await redis.set(`airdrop_waiting:${ctx.from.id}`, "1", "EX", 60);
            await ctx.reply(AIRDROP_COMMAND_REPLY);
        }
        else {
            await ctx.reply(NO_LOCATION);
        }
    });
}