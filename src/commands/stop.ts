import { Telegraf } from "telegraf";
import { stopListening } from "../services/listen/listen";
import { STOP_REPLY } from "../lib/replies/stop.reply";

export default function stopCommand(bot: Telegraf) {
    bot.command("stop", async (ctx) => {
        const tg_id = ctx.message.from.id;
        await stopListening(tg_id);
        await ctx.reply(STOP_REPLY);
    });
}