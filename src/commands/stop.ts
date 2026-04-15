import { Telegraf } from "telegraf";
import { stopListening } from "../services/listen/listen";
import { STOP_REPLY } from "../lib/replies/stop.reply";

export default function stop(bot: Telegraf) {
    bot.command("stop", async (ctx) => {
        const userId = ctx.message.from.id;
        await stopListening(userId);
        await ctx.reply(STOP_REPLY);
    });
}