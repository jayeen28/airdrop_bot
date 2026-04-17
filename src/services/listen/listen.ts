import { User } from "../../lib/models";

export async function startListening(tg_id: number) {
    return await User.findOneAndUpdate({ tg_id }, { $set: { listening: true } }, { returnDocument: 'after' });
}

export async function stopListening(tg_id: number) {
    return await User.findOneAndUpdate({ tg_id }, { $set: { listening: false } }, { returnDocument: 'after' });
}