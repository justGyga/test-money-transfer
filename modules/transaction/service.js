import { Op } from "sequelize";
import { getConnection } from "../../core/database/pg-adapter.js";
import { Transaction } from "../_models/transaction.js";
import { User } from "../_models/user.js";
import CurrencyService from "../currency/service.js";

class TransactionService {
    async getTransactionList(user, startPosition, limitPosition) {
        const count = await Transaction.count({ where: { [Op.or]: [{ from: user }, { to: user }] }, include: [{ model: User }] });
        const body = await Transaction.count({
            where: { [Op.or]: [{ from: user }, { to: user }] },
            include: [{ model: User }],
            offset: startPosition * limitPosition,
            limit: limitPosition
        });

        return { count, body };
    }

    async #makeTransaction(owner, target, ownerAmount, targetAmount) {
        const transaction = await getConnection().transaction();
        try {
            await Transaction.create({ from: owner.id, to: target.id, ownerAmount }, { transaction });
            await User.update({ balance: owner.balance - ownerAmount }, { where: { id: owner.id } }, { transaction });
            await User.update({ balance: target.balance + targetAmount }, { where: { id: target.id } }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            return false;
        }
    }

    async createTransaction(from, to, amount) {
        let transaction;
        const owner = await User.findByPk(from);
        const target = await User.findByPk(to);
        if (!owner || !target) return { notFound: true };

        if (target.currencyId == owner.currencyId) transaction = this.#makeTransaction(owner, target, amount, amount);
        else {
            const convertedAmount = await CurrencyService.convertMoney(amount, owner.code, target.code);
            if (!convertedAmount) return { convertError: true };
            transaction = this.#makeTransaction(owner, target, amount, convertedAmount);
        }
        return { transaction };
    }
}

export default TransactionService;
