import { User } from "../../lib/models";

export default async function addLocation(tg_id: number, lat: number, lng: number) {
    const user = await User.findOneAndUpdate({ tg_id }, {
        $set: {
            pin: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            tg_id,
            listening: true
        }
    }, { returnDocument: 'after' });

    return user;
}