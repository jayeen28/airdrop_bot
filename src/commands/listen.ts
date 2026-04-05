import { Telegraf } from "telegraf";
import startListening from "../services/listen/listen";

export default function listen(bot: Telegraf) {
    bot.command("listen", async (ctx) => {
        const userId = ctx.message.from.id;
        const user = await startListening(userId);

    });
}