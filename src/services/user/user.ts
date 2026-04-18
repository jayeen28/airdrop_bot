import { User as UserType } from "telegraf/types";
import { User } from "../../lib/models";

export async function createUser(tg_user: UserType) {
    await User.findOneAndUpdate({ tg_id: tg_user.id }, {
        $set: {
            tg_id: tg_user.id,
            listening: true,
            tg_data: tg_user
        }
    }, { upsert: true, returnDocument: 'after' });
}

export async function hasLocation(tg_id: number) {
    const user = await User.findOne({ tg_id });
    return Boolean(user?.pin);
}