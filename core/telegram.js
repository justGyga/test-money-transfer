import { BaseModule } from "./server.js";

// eslint-disable-next-line import/no-mutable-exports
export let telegramConnection = () => null;

export default class TelegramBot extends BaseModule {
    #bot;

    /**
     * @param {Bot} bot
     */
    constructor(bot) {
        super();
        this.#bot = bot;
    }

    async handler() {
        try {
            this.#bot.start();
            console.info("[Telegram] Connection is established");
        } catch (error) {
            console.error("[Telegram] Connection is crashed");
        }
    }

    async afterHandler() {
        telegramConnection = () => this.#bot;
    }
}
