import { Markup, Telegraf } from 'telegraf';
import { createUser } from '../services/user/user';
import { START_REPLY } from '../lib/replies/start.reply';

export default function startCommand(bot: Telegraf) {
    bot.start(async (ctx) => {
        await createUser(ctx.from);

        ctx.reply(
            START_REPLY,
            {
                parse_mode: 'Markdown',
                ...Markup.keyboard([
                    [Markup.button.locationRequest('📍 Send Current Location')]
                ])
                    .resize()
            });
    });
};