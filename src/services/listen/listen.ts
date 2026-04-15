import { User } from "../../lib/models";

export async function startListening(userId: number) {
    return await User.findOneAndUpdate({ userId }, { $set: { listening: true } }, { returnDocument: 'after' });
}

export async function stopListening(userId: number) {
    return await User.findOneAndUpdate({ userId }, { $set: { listening: false } }, { returnDocument: 'after' });
}