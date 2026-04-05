import { User } from "../../lib/models";

export default async function startListening(userId: number) {
    const user = await User.findOneAndUpdate({ userId }, { $set: { listening: true } }, { returnDocument: 'after' });
    return user;
}