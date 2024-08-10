import argon2 from "argon2";
import { Op } from "sequelize";
import { TokenGuard } from "../_commons/middlewares/token-guard.js";
import { Currency } from "../_models/currency";
import { User } from "../_models/user.js";

class UserService {
    async registration(doc) {
        if (await User.count({ where: { login: { [Op.iLike]: doc.login } }, raw: true })) {
            return [false, false];
        }
        doc.password = await argon2.hash(doc.password);
        const isCurrencyExists = await Currency.count({ where: { id: doc.currencyId } });
        if (!isCurrencyExists) return [true, false];
        await User.create(doc);
        return [true, true];
    }

    async auth(login, password) {
        const user = await User.findOne({ where: { login }, raw: true });
        if (!user || !(await argon2.verify(user.password, password))) return false;
        return await TokenGuard.generate({ id: user.id });
    }

    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) return false;
        return user;
    }

    async getUserList(startPosition, limitPosition, currency) {
        const currencyWhere = {};
        if (currency) currencyWhere.name = currency;
        const users = await User.findAll({
            offset: startPosition * limitPosition,
            limit: limitPosition,
            include: [{ model: Currency, as: "currency", where: currencyWhere }],
            raw: true
        });
        const count = await User.count({ include: [{ model: Currency, as: "currency", where: currencyWhere }] });
        return { count, body: users };
    }
}

export default UserService;
