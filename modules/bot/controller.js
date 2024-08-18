import autoBind from "auto-bind";
import CurrencyService from "../currency/service.js";
import TelegramService from "./service.js";

class TelegramBotController {
    #service;
    constructor() {
        autoBind(this);
        this.#service = new TelegramService();
    }

    async startHandler(context) {
        const { chat } = context.message;
        const userId = context.message.text.split(" ")[1];
        if (!userId) return context.reply("Can not get user id");
        try {
            const { notFound, alreadyAttachedToAnother, alreadyConnected, success } = await this.#service.registerUser(chat, userId);
            if (!success) {
                if (notFound) return context.reply(`Error while attaching: User not found`);
                if (alreadyAttachedToAnother) return context.reply(`Error while attaching: User already attached to bot with another id`);
                if (alreadyConnected) return context.reply(`Error while attaching: User connected to bot`);
            }
            return context.reply(`You have successfully linked to the bot. Thank you for using our system!!!`);
        } catch (error) {
            console.log(error);
            return context.reply("Ooops... Something went wrong...");
        }
    }

    async getCurrencies(context) {
        const rawCurrencies = await CurrencyService.getRatesForTg();
        const currencies = this.#service.makeBeautifulCurrencyString(rawCurrencies);
        context.reply(`<b>Code Rate:</b>\n${currencies}`, { parse_mode: "HTML" });
    }
}

export default new TelegramBotController();
