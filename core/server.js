/* eslint-disable no-empty-function */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import cors from "cors";
import express from "express";
import { createServer } from "node:http";

const TIMEOUT = 1000 * 60 * 10; // 10m

export class BaseModule {
    async beforeHandler(app) {}
    async handler(app) {}
    async afterHandler(app) {}

    async _resolve(app) {
        await this.beforeHandler(app);
        await this.handler(app);
        await this.afterHandler(app);
    }
}

class Server {
    #SIZE = 2 * 1024 * 1024; // 2MB

    constructor(PORT, services) {
        this.port = PORT;
        this.services = services;
        this.app = express();
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use("/public", express.static("public"));
        this.app.use(cors({ origin: true, credentials: true }));
        this.server = createServer(this.app);
    }
}

Server.prototype.initServices = async function () {
    if (!this.services.length) process.exit(1);
    for (const service of this.services) {
        await service._resolve(this.app);
    }
    console.log("[Main App] Services loaded");
    return Promise.resolve(this);
};

Server.prototype.run = function () {
    return new Promise((resolve, reject) => {
        this.server
            .listen(this.port, () => {
                console.log(`[Main App] Server started on port ${this.port}`);
                resolve(this.server);
            })
            .setTimeout(TIMEOUT);
    });
};

export default Server;
