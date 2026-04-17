import { Types } from "mongoose";
import { Telegraf } from "telegraf";
import { User } from "../../lib/models";
import { Message } from "../../lib/models/message.model";
import { getBot } from "../../lib/getBot";

const chunkSize = 25;

export default async function messageReceiver(msg: { messageId: string }) {
    const bot = getBot();
    const message = await Message.findOne({ _id: new Types.ObjectId(msg.messageId) });

    if (!message) return;

    const nearbyUsers = await User.find({
        pin: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        message.point.coordinates[0], // lng
                        message.point.coordinates[1]  // lat
                    ]
                },
                $maxDistance: 500
            }
        }
    });

    for (let i = 0; i < nearbyUsers.length; i += chunkSize) {
        const chunk = nearbyUsers.slice(i, i + chunkSize);

        await Promise.allSettled(
            chunk.map(async user => {
                switch (message.type) {
                    case "text":
                        await bot.telegram.sendMessage(user.tg_id, message.message);
                        break;
                }
            })
        );

        await new Promise(res => setTimeout(res, 1000)); // 1 sec delay
    }
}