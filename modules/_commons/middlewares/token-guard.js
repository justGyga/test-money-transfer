import jwt from "jsonwebtoken";
import _ from "lodash";
import { Currency } from "../../_models/currency.js";
import { User } from "../../_models/user.js";

const TOKEN_SECRET_WORD = process.env.TOKEN_SECRET_WORD || "MySecretWord";

const checkUserToken = async (payload) => {
    const isUserExist = await User.findByPk(payload.id, { attributes: ["id"], raw: true, include: [{ model: Currency, as: "currency" }] });
    if (!isUserExist) return false;
    return isUserExist;
};

export class TokenGuard {
    static verify = async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            if (!token) {
                throw new Error();
            }
            const tokenPayload = jwt.verify(token, TOKEN_SECRET_WORD);
            const payload = _.omit(tokenPayload, "iat", "exp");
            const isUserExist = await checkUserToken(payload);
            if (!isUserExist) return res.status(401).json({ message: "token payload is not correct" });
            req.user = isUserExist;
            next();
        } catch (error) {
            res.status(401).json({ message: "Token can not be validate" });
            console.log(error.message);
        }
    };

    static generate = async (payload) => {
        try {
            const expiresIn = process.env.TOKEN_EXPIRE || "7d";
            return jwt.sign(payload, TOKEN_SECRET_WORD, { expiresIn });
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
