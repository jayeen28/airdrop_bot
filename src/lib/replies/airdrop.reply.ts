export const AIRDROP_COMMAND_REPLY = "📢 Send the content for your airdrop (text, singe photo, single video or voice).\n\nI will wait for one minute only, after that you will have to use the /airdrop command again."
export const AIRDROP_WITHOUT_WAITING = "To send an airdrop, use /airdrop and follow the steps 👍";
export const AIRDROP_CREATED = "🪂 Airdrop created";
export const SUCCESSFUL_AIR_DROPS = (chunkSize: number) => `🪂 Your airdrop was delivered to ${chunkSize} ${chunkSize === 1 ? "user" : "users"}.`
