import { Telegraf } from "telegraf";
import listenCommand from "./listen";
import startCommand from "./start";
import stopCommand from "./stop";
import airdropCommand from "./airdrop";

export default function registerCommands(bot: Telegraf) {
    startCommand(bot)
    listenCommand(bot);
    stopCommand(bot);
    airdropCommand(bot);
}