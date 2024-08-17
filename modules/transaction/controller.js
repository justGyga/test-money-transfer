import autoBind from "auto-bind";
import TransactionService from "./service.js";

class TransactionController {
    #service;
    constructor() {
        autoBind(this);
        this.#service = new TransactionService();
    }

    async getList(req, res) {
        const { id } = req.user;
        const { startPosition, limitPosition } = req.query;

        res.status(200).json(await this.#service.getTransactionList(id, +startPosition, +limitPosition));
    }

    async createTransaction(req, res) {
        const { to, amount } = req.body;
        const from = req.user.id;

        const { notFound, forbidden, convertError, transaction } = await this.#service.createTransaction(from, to, amount);
        if (notFound) return res.status(404).json({ message: "Users not found" });
        if (forbidden) return res.status(404).json({ message: "Your balance is less than required" });
        if (convertError) return res.status(423).json({ message: "Currency rate is not in system" });

        res.status(201).json(transaction);
    }
}

export default new TransactionController();
