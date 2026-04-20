import { AIRDROP_WITHOUT_WAITING } from "./airdrop.reply";

export const LOCATION_ADDED = ({ latitude, longitude }: { latitude: number, longitude: number }) => (
    `✅ *Location received!*\n` +
    `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\n` +
    'Any nearby airdrops will be notified... 🎯\n\n' +
    AIRDROP_WITHOUT_WAITING
);

export const NO_LOCATION = '❗❗ You have not shared your location yet❗❗\n\n' +
    'To find airdrops near you, share your location using any of these methods:\n\n' +
    '*One-time options (recommended):*\n' +
    '• Tap 📍 *Send Current Location* below — sends your GPS position once\n' +
    '• Or tap 📎 attachment → *Location* → drag pin on map to choose manually\n\n' +
    '*Live location (optional):*\n' +
    '• Tap 📎 attachment → *Location* → *Share My Live Location* — updates automatically for 15 min to 8 hours\n\n' +
    '_Your location stays private and is only used to find nearby drops._\n\n' + 'Use /help to see all commands and features.'