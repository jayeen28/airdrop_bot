import { Markup, Telegraf } from "telegraf";
import { startListening } from "../services/listen/listen";
import { hasLocation } from "../services/user/user";
import { LISTEN_HAS_LOCATION, LISTEN_NO_LOCATION } from "../lib/replies/listen.reply";

export default function listen(bot: Telegraf) {
    bot.command("listen", async (ctx) => {
        const userId = ctx.message.from.id;
        if (await hasLocation(userId)) {
            await startListening(userId);
            await ctx.reply(LISTEN_HAS_LOCATION);
        } else {
            ctx.reply(
                LISTEN_NO_LOCATION,
                {
                    parse_mode: 'Markdown',
                    ...Markup.keyboard([
                        [Markup.button.locationRequest('📍 Send Current Location')]
                    ])
                        .resize()
                }
            );
        }
    });
}