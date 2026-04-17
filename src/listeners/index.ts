import { Telegraf } from "telegraf";
import location from "./location";
import messageListener from "./message";

export default function registerListeners(bot: Telegraf) {
    location(bot);
    messageListener(bot);
}