import { Telegraf } from "telegraf";
import { Message } from "../lib/models/message.model";

export default function messageReaction(bot: Telegraf) {
    bot.on('message_reaction', async (ctx) => {
        const reaction = ctx.update.message_reaction;

        const newReactions = reaction.new_reaction.filter(
            newR => !reaction.old_reaction.some(
                oldR => JSON.stringify(oldR) === JSON.stringify(newR)
            )
        );

        if (newReactions.length === 0) return;

        const key = `${reaction.chat.id}_${reaction.message_id}`;

        await Message.updateOne(
            { sentMessageKeys: key },
            { $inc: { reactionCount: newReactions.length } }
        );
    })
}