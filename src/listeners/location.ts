import { Markup, Telegraf } from "telegraf";
import addLocation from "../services/location/location";

export default function location(bot: Telegraf) {

    // Handle one-time location (GPS or manual selection)
    bot.on('location', async (ctx) => {
        try {
            const { latitude, longitude } = ctx.message.location;
            const tg_id = ctx.message.from.id;

            // Check if it's a live location update
            if ('live_period' in ctx.message.location) {
                await ctx.reply(
                    '✅ *Live location active!*\n\n' +
                    `📍 Starting position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n` +
                    `⏱ Updates every few seconds for ${ctx.message.location.live_period} seconds\n\n` +
                    "I'll track your movement and notify nearby airdrops 🚀",
                    { parse_mode: 'Markdown' }
                );
            } else {
                // One-time location
                await ctx.reply('⏳ Finding airdrops near you...', Markup.removeKeyboard());

                await addLocation(tg_id, latitude, longitude);

                await ctx.reply(
                    `✅ *Location received!*\n` +
                    `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\n` +
                    'Any nearby airdrops will be notified... 🎯',
                    { parse_mode: 'Markdown' }
                );
            }

        } catch (e) {
            console.error(e);
            await ctx.reply('❌ Error processing location. Try again?', Markup.removeKeyboard());
        }
    });


    // Handle live location updates (edited messages with new coordinates)
    bot.on('edited_message', async (ctx) => {
        if ('location' in ctx.editedMessage && ctx.editedMessage.location) {
            const { latitude, longitude } = ctx.editedMessage.location;
            const tg_id = ctx.editedMessage.from.id;

            // Update location in your service
            await addLocation(tg_id, latitude, longitude);

            // Optionally notify user of update (or keep silent)
            // await ctx.reply('📍 Location updated!', { parse_mode: 'Markdown' });
        }
    });
}