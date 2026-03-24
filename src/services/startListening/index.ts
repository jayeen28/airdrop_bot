import { User } from "../../lib/models";

export default async function startListening(userId: string, lat: number, lng: number) {
    const user = await User.create({
        pin: {
            type: 'Point',
            coordinates: [lng, lat]
        },
        userId,
        listening: true
    });

    return user;
}