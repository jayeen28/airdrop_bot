import { Markup, Telegraf } from "telegraf";
import addLocation from "../services/location/location";
import { LIVE_LOCATION_ADD, LOCATION_ADDED, LOCATION_PROCESSING_ERROR, ONE_TIME_LOCATION_ADD } from "../lib/replies/location.reply";

export default function locationListener(bot: Telegraf) {

    // Handle one-time location (GPS or manual selection)
    bot.on('location', async (ctx) => {
        try {
            const { latitude, longitude } = ctx.message.location;
            const tg_id = ctx.message.from.id;

            // Check if it's a live location update
            if ('live_period' in ctx.message.location) {
                await ctx.reply(
                    LIVE_LOCATION_ADD({ latitude, longitude, live_period: ctx.message.location.live_period }),
                    { parse_mode: 'Markdown' }
                );
            } else {
                // One-time location
                await ctx.reply(ONE_TIME_LOCATION_ADD, Markup.removeKeyboard());

                await addLocation(tg_id, latitude, longitude);

                await ctx.reply(
                    LOCATION_ADDED({ latitude, longitude }),
                    { parse_mode: 'Markdown' }
                );
            }

        } catch (e) {
            console.error(e);
            await ctx.reply(LOCATION_PROCESSING_ERROR, Markup.removeKeyboard());
        }
    });


    // Handle live location updates (edited messages with new coordinates)
    bot.on('edited_message', async (ctx) => {
        if ('location' in ctx.editedMessage && ctx.editedMessage.location) {
            const { latitude, longitude } = ctx.editedMessage.location;
            const tg_id = ctx.editedMessage.from.id;

            // Update location in your service
            await addLocation(tg_id, latitude, longitude);
        }
    });
}