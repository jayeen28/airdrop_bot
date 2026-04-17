import { Telegraf } from "telegraf";
import listenCommand from "./listen";
import startCommand from "./start";
import stopCommand from "./stop";
import messageCommand from "./message";

export default function registerCommands(bot: Telegraf) {
    startCommand(bot)
    listenCommand(bot);
    stopCommand(bot);
    messageCommand(bot);
}