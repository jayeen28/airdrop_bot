import { Telegraf } from "telegraf";
import locationListener from "./location";
import messageListener from "./message";
import messageReaction from "./message-reaction";

export default function registerListeners(bot: Telegraf) {
    locationListener(bot);
    messageListener(bot);
    messageReaction(bot);
}