import { Op } from "sequelize";
import { getConnection } from "../../core/database/pg-adapter.js";
import { Transaction } from "../_models/transaction.js";
import { User } from "../_models/user.js";
import CurrencyService from "../currency/service.js";

class TransactionService {
    async getTransactionList(user, startPosition, limitPosition) {
        const count = await Transaction.count({
            where: { [Op.or]: [{ from: user }, { to: user }] },
            include: [
                { model: User, as: "toUser" },
                { model: User, as: "fromUser" }
            ]
        });
        const body = await Transaction.findAll({
            where: { [Op.or]: [{ from: user }, { to: user }] },
            attributes: { exclude: ["to", "from"] },
            include: [
                { model: User, as: "toUser", attributes: ["id", "login", "currencyId"] },
                { model: User, as: "fromUser", attributes: ["id", "login", "currencyId"] }
            ],
            offset: startPosition * limitPosition,
            limit: limitPosition,
            raw: true
        });

        return { count, body };
    }

    async #makeTransaction(owner, target, ownerAmount, targetAmount) {
        const transaction = await getConnection().transaction();
        let tr = false;
        try {
            tr = await Transaction.create({ from: owner.id, to: target.id, amount: ownerAmount }, { transaction });
            await User.update({ balance: owner.balance - ownerAmount }, { where: { id: owner.id } }, { transaction });
            await User.update({ balance: target.balance + targetAmount }, { where: { id: target.id } }, { transaction });
            await transaction.commit();
        } catch (error) {
            console.error(`${new Date()} | Transaction create error:`);
            console.error(error);
            await transaction.rollback();
            tr = false;
        }
        return tr;
    }

    async createTransaction(from, to, ownerAmount) {
        let targetAmount = ownerAmount;
        const owner = await User.findByPk(from);
        const target = await User.findByPk(to);
        if (!owner || !target) return { notFound: true };
        if (owner.balance < ownerAmount) return { forbidden: true };

        if (target.currencyId != owner.currencyId) {
            targetAmount = await CurrencyService.convertMoney(ownerAmount, owner.currencyId, target.currencyId, owner.id);
            if (!targetAmount) return { convertError: true };
        }

        const transaction = await this.#makeTransaction(owner, target, ownerAmount, targetAmount);
        return { transaction: { owner, target, ownerAmount, targetAmount, transaction } };
    }
}

export default TransactionService;
