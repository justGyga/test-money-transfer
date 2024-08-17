import autoBind from "auto-bind";
import CurrencyService from "./service.js";

class CurrencyController {
    #service;
    constructor() {
        autoBind(this);
        this.#service = new CurrencyService();
    }

    async getRatesByOwnCurrency(req, res) {
        const [isCurrenciesExist, isRatesExist] = await this.#service.getRatesByOwnCurrency(req.user.currency.code, req.query.targets);
        if (!isCurrenciesExist) return res.status(404).json({ message: "Currencies not found in DB" });
        if (!isRatesExist) return res.status(423).json({ message: "Can't get currencies rates" });

        res.status(200).json(isRatesExist);
    }
}

export default new CurrencyController();
