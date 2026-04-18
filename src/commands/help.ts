import { Telegraf } from "telegraf";
import { HELP_REPLY } from "../lib/replies/help.reply";

export default function helpCommand(bot: Telegraf) {
    bot.command("help", async (ctx) => {
        await ctx.reply(HELP_REPLY, { parse_mode: "Markdown" });
    });
}
