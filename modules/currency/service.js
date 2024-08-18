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
        const { data } = response;
        if (data.result != "success") {
            await redis.set(`${NON_CONVERT}:user:${userId}`, JSON.stringify({ amount, base, target }), "EX", process.env.CONVERT_TTL);
            return false;
        }
        const { conversion_rate: rate } = data;
        return amount * rate;
    }

    static async getRatesForTg() {
        const APIstring = `${process.env.CURRENCY_API_HOST}/${process.env.CURRENCY_API_KEY}/latest/USD`;
        const response = await axios.get(APIstring);
        const { data } = response;
        if (data.result != "success") return false;
        const { conversion_rates: rates } = data;
        return rates;
    }

    async getRatesByOwnCurrency(userCurrency, targets = []) {
        const targetsCodes = (await Currency.findAll({ where: { code: targets }, attributes: ["code"] })).map(({ code }) => code);
        if (!targetsCodes.length) return [false, false];
        const APIstring = `${process.env.CURRENCY_API_HOST}/${process.env.CURRENCY_API_KEY}/latest/${userCurrency}`;
        const response = await axios.get(APIstring);
        const { data } = response;
        if (data.result != "success") return [true, false];
        const { conversion_rates: rates } = data;
        const resultRates = {};
        targetsCodes.forEach((code) => {
            resultRates[code] = rates[code];
        });
        return [true, resultRates];
    }
}
export default CurrencyService;
