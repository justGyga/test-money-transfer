import { Sequelize } from "sequelize";
import PostgresAdapter from "./core/database/pg-adapter.js";
import RedisAdapter from "./core/database/redis-adapter.js";
import Routing from "./core/routes.js";
import Server from "./core/server.js";
import SwaggerDoc from "./core/swagger.js";
import { models } from "./modules/_models/_index.js";
import { authRouter, userRouter } from "./modules/user/router.js";

const APP_PORT = process.env.APP_PORT || 7000;

new Server(APP_PORT, [
    new RedisAdapter({
        host: process.env.R_HOST || "127.0.0.1",
        port: process.env.R_PORT || 6379,
        db: process.env.R_DB || 0,
        lazyConnect: true
    }),
    new PostgresAdapter(
        new Sequelize(process.env.DB_NAME, process.env.PG_USER, process.env.PG_PASS, {
            dialect: "postgres",
            host: process.env.PG_HOST || "127.0.0.1",
            port: process.env.PG_PORT || 5432,
            logging: false,
            query: { raw: true, nest: true },
            sync: { alter: true }
        })
    ).registerModels(models),
    new Routing([
        { prefix: "/user", router: userRouter },
        { prefix: "/sign", router: authRouter }
    ]),
    new SwaggerDoc(
        {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "MONEY-TRANSFER MASTER-API SERVER",
                    version: "1.0.0",
                    description: "The REST API documentation for money-transfer test.",
                    contact: {
                        name: "TheGyga",
                        url: "https://github.com/justGyga"
                    }
                },
                servers: [{ url: process.env.APP_HOST }],
                components: {
                    securitySchemes: {
                        bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
                    }
                },
                security: [{ bearer: [] }]
            },
            apis: ["./documents/**/*.yml", "./documents/**/*.yaml"]
        },
        { docExpansion: "none" }
    )
])
    .initServices()
    .then((server) => server.run(() => console.log("Server started on port %s", APP_PORT)));
