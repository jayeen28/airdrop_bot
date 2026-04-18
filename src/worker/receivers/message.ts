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

    if (nearbyUsers.length === 0) await bot.telegram.sendMessage((message.sender as unknown as UserDocument).tg_id, NO_USER_FOUND_TO_AIRDROP);

    for (let i = 0; i < nearbyUsers.length; i += chunkSize) {
        const chunk = nearbyUsers.slice(i, i + chunkSize);

        await Promise.allSettled(
            chunk.map(async user => {
                switch (message.type) {
                    case "text":
                        await bot.telegram.sendMessage(user.tg_id, message.message);
                        break;

                    case "photo":
                        await bot.telegram.sendPhoto(user.tg_id, message.fileId!, {
                            caption: message.caption || undefined
                        });
                        break;

                    case "video":
                        await bot.telegram.sendVideo(user.tg_id, message.fileId!, {
                            caption: message.caption || undefined
                        });
                        break;

                    case "voice":
                        await bot.telegram.sendVoice(user.tg_id, message.fileId!);
                        break;

                    case "voice":
                        await bot.telegram.sendAudio(user.tg_id, message.fileId!, {
                            caption: message.caption || undefined
                        });
                        break;

                    default:
                        console.warn(`Unsupported message type: ${message.type}`);
                }
            })
        );

        await bot.telegram.sendMessage((message.sender as unknown as UserDocument).tg_id, SUCCESSFUL_AIR_DROPS(chunk.length))

        await new Promise(res => setTimeout(res, 1000)); // 1 sec delay
    }
}