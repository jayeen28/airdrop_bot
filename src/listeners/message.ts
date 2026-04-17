import { Telegraf } from "telegraf";
import message from "../services/message/message";
import { redis } from "../lib/redis";
import { AIRDROP_CREATED, AIRDROP_WITHOUT_WAITING } from "../lib/replies/airdrop.reply";

export default function messageListener(bot: Telegraf) {
    bot.on('message', async (ctx, next) => {
        if ("text" in ctx.message && ctx.message.text.startsWith("/")) return next();

        const isWaiting = await redis.get(`airdrop_waiting:${ctx.from.id}`);
        if (!isWaiting) return ctx.reply(AIRDROP_WITHOUT_WAITING);

        let payload: any = {
            tg_id: ctx.from.id
        };

        if ("text" in ctx.message) {
            payload.type = "text";
            payload.message = ctx.message.text;
        }

        if ("photo" in ctx.message) {
            const photo = ctx.message.photo.pop();
            if (photo) {
                payload.type = "photo";
                payload.fileId = photo.file_id;
                payload.caption = ctx.message.caption || "";
            }
        }

        if ("video" in ctx.message) {
            payload.type = "video";
            payload.fileId = ctx.message.video.file_id;
            payload.caption = ctx.message.caption || "";
        }

        if ("voice" in ctx.message) {
            payload.type = "voice";
            payload.fileId = ctx.message.voice.file_id;
        }

        await message(payload);

        await redis.del(`airdrop_waiting:${ctx.from.id}`);
        await ctx.reply(AIRDROP_CREATED);
    })
}