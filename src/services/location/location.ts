import { User } from "../../lib/models";

export default async function addLocation(userId: number, lat: number, lng: number) {
    const user = await User.findOneAndUpdate({ userId }, {
        $set: {
            pin: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            userId,
            listening: true
        }
    }, { returnDocument: 'after' });

    return user;
}