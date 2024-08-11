import axios from "axios";
import { redis } from "../../core/database/redis-adapter.js";
import { NON_CONVERT } from "../_commons/vars/namespaces.js";
import { Currency } from "../_models/currency.js";

class CurrencyService {
    static async convertMoney(amount, base, target, userId) {
        const areCurrenciesExist = await Currency.count({ where: { code: [base, target] } });
        if (areCurrenciesExist != 2) return false;
        const APIstring = `${process.env.CURRENCY_API_HOST}/${process.env.CURRENCY_API_KEY}/pair/${base}/${target}`;
        const response = await axios.get(APIstring);
        console.log(response);
        const { data } = response;
        if (data.result != "success") {
            await redis.set(`${NON_CONVERT}:user:${userId}`, JSON.stringify({ amount, base, target }), "EX", process.env.CONVERT_TTL);
        }
        const { conversation_rate: rate } = data;
        return amount * rate;
    }
}
export default CurrencyService;
