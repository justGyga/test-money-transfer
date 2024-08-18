import { Bot, GrammyError, HttpError } from "grammy";
import Controller from "./controller.js";

const bot = new Bot(process.env.TELEGRAM_TOKEN);

bot.command("start", Controller.startHandler);
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
