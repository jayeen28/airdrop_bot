import { Context, Telegraf } from "telegraf";
import startCommand from "./start";

export default function registerCommands(bot: Telegraf) {
    startCommand(bot)
}