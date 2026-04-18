import { Telegraf } from "telegraf";
import listenCommand from "./listen";
import startCommand from "./start";
import stopCommand from "./stop";
import airdropCommand from "./airdrop";
import helpCommand from "./help";

export default function registerCommands(bot: Telegraf) {
    startCommand(bot)
    helpCommand(bot);
    listenCommand(bot);
    stopCommand(bot);
    airdropCommand(bot);
}