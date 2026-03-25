import { Telegraf } from "telegraf";
import location from "./location";

export default function registerListeners(bot: Telegraf) {
    location(bot);
}