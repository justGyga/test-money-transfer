import autoBind from "auto-bind";
import UserService from "./service.js";

class UserController {
    #service;
    constructor() {
        autoBind(this);
        this.#service = new UserService();
    }

    async signUp(req, res) {
        try {
            const [isLoginTaken, isCurrencyExists] = await this.#service.registration(req.body);
            if (!isLoginTaken) return res.status(401).json({ message: "That login is already taken" });
            if (!isCurrencyExists) return res.status(404).json({ message: "That currency not found" });
            res.status(201).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Ooops... Something went wrong..." });
            console.log(error);
        }
    }

    async signIn(req, res) {
        try {
            const { login, password } = req.body;
            const isAuth = await this.#service.auth(login, password);
            if (!isAuth) return res.status(404).json({ message: "Login or password isn't correct" });
            res.status(200).json({ token: isAuth });
        } catch (error) {
            res.status(500).json({ message: "Ooops... Something went wrong..." });
            console.log(error);
        }
    }

    async getMe(req, res) {
        try {
            const { id } = req.user;
            const isUserFound = await this.#service.getUserById(id);
            if (!isUserFound) return res.status(404).json({ message: "User not found" });
            res.status(200).json(isUserFound);
        } catch (error) {
            res.status(500).json({ message: "Ooops... Something went wrong..." });
            console.log(error);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const isUserFound = await this.#service.getUserById(id);
            if (!isUserFound) return res.status(404).json({ message: "User not found" });
            res.status(200).json(isUserFound);
        } catch (error) {
            res.status(500).json({ message: "Ooops... Something went wrong..." });
            console.log(error);
        }
    }

    async getList(req, res) {
        try {
            const { startPosition, limitPosition, currencyIds } = req.query;
            res.status(200).json(await this.#service.getUserList(+startPosition, +limitPosition, currencyIds));
        } catch (error) {
            res.status(500).json({ message: "Ooops... Something went wrong..." });
            console.log(error);
        }
    }
}

export default new UserController();
