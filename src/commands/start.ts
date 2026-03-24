import { Telegraf, Context, Markup } from 'telegraf';

export default function start(bot: Telegraf) {
    bot.start((ctx: Context) => {
        ctx.reply(
            'Welcome! Please share your location to get started.',
            Markup.keyboard([
                [Markup.button.locationRequest('📍 Share Location')]
            ])
                .oneTime()
                .resize()
        );
    });

    // Handle location messages
    bot.on('location', (ctx) => {
        const { latitude, longitude } = ctx.message.location;

        ctx.reply(
            `Thanks! Received your location:\nLatitude: ${latitude}\nLongitude: ${longitude}`
        );

        // Remove the location keyboard after receiving it
        ctx.reply('Location saved!', Markup.removeKeyboard());
    });
}