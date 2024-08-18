import { getConnection } from "../../core/database/pg-adapter.js";
import { telegramConnection } from "../../core/telegram.js";
import { getHourPeriod } from "../_commons/functions/date-handlers.js";
import CurrencyService from "../currency/service.js";

export default async () => {
    const replacements = getHourPeriod(new Date());
    const transactions = await getConnection().query(
        `SELECT 
            SUM(amount),
            tr.from AS owner,
            base_user."telegramId" AS "telegramId",
            base_user."currencyId",
            COUNT(tr.id) as count
        FROM "transactions" tr
        JOIN "users" base_user ON tr.from=base_user.id AND base_user."telegramId" IS NOT NULL
        JOIN "users" tou ON tr.to=tou.id
        WHERE tr."createdAt" BETWEEN :start AND :end
        GROUP BY owner, base_user."telegramId", base_user."telegramName", base_user."currencyId"`,
        { replacements }
    );
    for (const transaction of transactions) {
        if (transaction.currencyId != "USD")
            transaction.sum = await CurrencyService.convertMoney(transaction.sum, transaction.currencyId, "USD", transaction.owner);
    }
    Promise.all(
        transactions
            .filter(({ sum }) => !!sum)
            .map(({ sum, telegramId, count }) =>
                telegramConnection().api.sendMessage(telegramId, `For last hour you make ${count} for a total amount of ${sum} USD`)
            )
    );
};
