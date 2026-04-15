import { Context, Telegraf } from "telegraf";
import startCommand from "./start";
import listen from "./listen";
import stop from "./stop";

export default function registerCommands(bot: Telegraf) {
    startCommand(bot)
    listen(bot);
    stop(bot);
}