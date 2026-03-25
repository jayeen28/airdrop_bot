import { Telegraf, Context, Markup } from 'telegraf';
import startListening from '../services/startListening';

export default function start(bot: Telegraf) {
    bot.start((ctx: Context) => {
        ctx.reply(
            '🎉 *Welcome to Airdrop Finder!*\n\n' +
            'To find airdrops near you, share your location using any of these methods:\n\n' +
            '*One-time options (recommended):*\n' +
            '• Tap 📍 *Send Current Location* below — sends your GPS position once\n' +
            '• Or tap 📎 attachment → *Location* → drag pin on map to choose manually\n\n' +
            '*Live location (optional):*\n' +
            '• Tap 📎 attachment → *Location* → *Share My Live Location* — updates automatically for 15 min to 8 hours\n\n' +
            '_Your location stays private and is only used to find nearby drops._',
            {
                parse_mode: 'Markdown',
                ...Markup.keyboard([
                    [Markup.button.locationRequest('📍 Send Current Location')]
                ])
                    .resize()
            }
        );
    });
};