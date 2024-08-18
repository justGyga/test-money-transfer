import { User } from "../_models/user.js";

export default class TelegramService {
    async registerUser(telegramId, userId) {
        const user = await User.findByPk(userId);
        if (!user) return { notFound: true };
        if (user.telegramId != null && user.telegramId != telegramId) return { alreadyAttachedToAnother: true };
        if (user.telegramId == telegramId) return { alreadyConnected: true };
        user.telegramId = telegramId;
        await user.save();
        return { success: true };
    }
}
