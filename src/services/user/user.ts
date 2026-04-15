import { User as UserType } from "telegraf/types";
import { User } from "../../lib/models";

export async function createUser(tg_user: UserType) {
    await User.findOneAndUpdate({ userId: tg_user.id }, {
        $set: {
            userId: tg_user.id,
            listening: true
        }
    }, { upsert: true, returnDocument: 'after' });
}

export async function hasLocation(userId: number) {
    const user = await User.findOne({ userId });
    return Boolean(user?.pin);
}