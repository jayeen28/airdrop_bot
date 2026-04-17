import { Telegraf } from "telegraf";
import message from "../services/message/message";
import { InputFile, InputMediaPhoto, InputTextMessageContent } from "telegraf/types";

export default function messageCommand(bot: Telegraf) {
    bot.command('message', async (ctx) => {
        await message({
            tg_id: ctx.message.from.id,
            type: 'text',
            message: ctx.message.text,
        })
    });
}