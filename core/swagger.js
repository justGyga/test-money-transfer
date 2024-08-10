import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUI from "swagger-ui-express";
import { BaseModule } from "./server.js";

export default class SwaggerDoc extends BaseModule {
    #config;
    #options;

    constructor(config, options = undefined) {
        super();
        this.#config = config;
        this.#options = options;
    }

    async handler(app) {
        const document = swaggerJSDoc(this.#config);
        app.use("/docs", SwaggerUI.serve, SwaggerUI.setup(document, { swaggerOptions: this.#options }));
        console.log(`[Swagger] swagger started on\n\t${process.env.APP_HOST}/docs`);
    }
}
