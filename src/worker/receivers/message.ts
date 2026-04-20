import { Types } from "mongoose";
import { getBot } from "../../lib/getBot";
import { User, UserDocument } from "../../lib/models";
import { Message } from "../../lib/models/message.model";
import { NO_USER_FOUND_TO_AIRDROP, SUCCESSFUL_AIR_DROPS } from "../../lib/replies/airdrop.reply";

const chunkSize = 25;

export default async function messageReceiver(msg: { messageId: string }) {
    const bot = getBot();
    const message = await Message.findOne({ _id: new Types.ObjectId(msg.messageId) }).populate([{ path: 'sender' }]);

    if (!message) return;

    const nearbyUsers = await User.find({
        _id: { $ne: message.sender },
        listening: true,
        pin: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        message.point.coordinates[0], // lng
                        message.point.coordinates[1]  // lat
                    ]
                },
                $maxDistance: message.radius
            }
        }
    });

    if (nearbyUsers.length === 0) {
        await bot.telegram.sendMessage((message.sender as unknown as UserDocument).tg_id, NO_USER_FOUND_TO_AIRDROP);
        return;
    }

    const sentMessageKeys: string[] = [];

    for (let i = 0; i < nearbyUsers.length; i += chunkSize) {
        const chunk = nearbyUsers.slice(i, i + chunkSize);

        const results = await Promise.allSettled(
            chunk.map(async user => {
                let sentMsg;
                switch (message.type) {
                    case "text":
                        sentMsg = await bot.telegram.sendMessage(user.tg_id, message.message);
                        break;
                    case "photo":
                        sentMsg = await bot.telegram.sendPhoto(user.tg_id, message.fileId!, { caption: message.caption || undefined });
                        break;
                    case "video":
                        sentMsg = await bot.telegram.sendVideo(user.tg_id, message.fileId!, { caption: message.caption || undefined });
                        break;
                    case "voice":
                        sentMsg = await bot.telegram.sendVoice(user.tg_id, message.fileId!);
                        break;
                }
                return sentMsg ? `${sentMsg.chat.id}_${sentMsg.message_id}` : undefined;
            })
        );

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
                sentMessageKeys.push(result.value);
            }
        }

        await new Promise(res => setTimeout(res, 1000)); // 1 sec delay
    }

    await Message.findByIdAndUpdate(message._id, { $set: { sentMessageKeys } });

    if (nearbyUsers.length) {
        await bot.telegram.sendMessage((message.sender as unknown as UserDocument).tg_id, SUCCESSFUL_AIR_DROPS(nearbyUsers.length));
        return;
    }
}