// eslint-disable-next-line import/no-extraneous-dependencies
import { Bot, GrammyError, HttpError } from "grammy";
import Controller from "./controller.js";

const BOT_COMMANDS = { START: "start", GET_CURRENCIES: "get_currencies" };

const bot = new Bot(process.env.TELEGRAM_TOKEN);

bot.api.setMyCommands([
    { command: BOT_COMMANDS.START, description: "Attach your account to tg" },
    { command: BOT_COMMANDS.GET_CURRENCIES, description: "Get currencies rates with USD base" }
]);

bot.command(BOT_COMMANDS.START, Controller.startHandler);
bot.command(BOT_COMMANDS.GET_CURRENCIES, Controller.getCurrencies);
bot.catch((exception) => {
    const context = exception.ctx;
    console.info(`[Telegram] Error while handling ${context.update.update_id}`);
    if (exception.error instanceof GrammyError) {
        console.error(`[Telegram] Error in request: ${exception.error.description}`);
    } else if (exception.error instanceof HttpError) {
        console.error(`[Telegram] Could not contact Telegram: ${exception.error}`);
    } else console.error(`Unknown error: ${exception.error}`);
});

export default bot;
