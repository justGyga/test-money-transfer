import { Router as ExpressRouter } from "express";
import { BaseModule } from "./server.js";

export default class Routing extends BaseModule {
    #mainRouter;

    constructor(routers = []) {
        super();
        this.#mainRouter = ExpressRouter();
        routers.forEach(({ prefix, router }) => this.#mainRouter.use(prefix ?? "", router));
    }

    async handler(app) {
        app.use("", this.#mainRouter);
        console.log("[Routing] Routes loaded");
    }
}
