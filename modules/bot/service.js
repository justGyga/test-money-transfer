import { telegramConnection } from "../../core/telegram.js";
import { User } from "../_models/user.js";

export default class TelegramService {
    async registerUser(chat, userId) {
        const { id, username } = chat;
        const user = await User.findByPk(userId);
        if (!user) return { notFound: true };
        if (user.telegramId != null && user.telegramId != id) return { alreadyAttachedToAnother: true };
        if (user.telegramId == id) return { alreadyConnected: true };
        await User.update({ telegramId: id, telegramName: username }, { where: { id: userId } });
        return { success: true };
    }

    static async sendTransactionToUsers(doc) {
        const { owner, target, ownerAmount, targetAmount } = doc;
        if (owner.telegramId)
            telegramConnection().api.sendMessage(
                owner.telegramId,
                `You send ${ownerAmount} ${owner.currencyId} to user ${target?.telegramName ? `@${target.telegramName}` : target.id}`
            );
        if (target.telegramId)
            telegramConnection().api.sendMessage(target.telegramId, `You received ${targetAmount} ${target.currencyId} from user @${owner.telegramName}`);
    }

    makeBeautifulCurrencyString(rowCurrencies) {
        const { USD, ...otherCurrencies } = rowCurrencies;
        return Object.keys(otherCurrencies)
            .map((code) => `${code}: ${otherCurrencies[code]}`)
            .join("\n");
    }
}
