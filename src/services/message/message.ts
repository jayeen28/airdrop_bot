import { MessagePayload } from "../../lib/types";
import { User } from "../../lib/models";
import { Message } from "../../lib/models/message.model";
import { publish } from "../../worker/worker";

export default async function message(payload: MessagePayload) {
    const user = await User.findOne({
        tg_id: payload.tg_id
    });

    if (!user || !user.pin) return;

    const message = await Message.create({
        sender: user._id,
        point: user?.pin,
        type: payload.type,
        message: payload.message,
        fileId: payload.fileId,
        caption: payload.caption,
    });

    await publish('message', JSON.stringify({ messageId: message._id }));
}