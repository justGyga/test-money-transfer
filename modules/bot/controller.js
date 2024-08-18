import autoBind from "auto-bind";
import TelegramService from "./service.js";

class TelegramBotController {
    #service;
    constructor() {
        autoBind(this);
        this.#service = new TelegramService();
    }

    async startHandler(context) {
        const telegramId = context.message.from.id;
        const userId = context.message.text.split(" ")[1];
        if (!userId) return context.reply("Can not get user id");
        try {
            const { notFound, alreadyAttachedToAnother, alreadyConnected, success } = await this.#service.registerUser(telegramId, userId);
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
}

export default new TelegramBotController();
