import { BaseModule } from "../server.js";

// eslint-disable-next-line import/no-mutable-exports
export let getConnection = () => null;

class PostgresAdapter extends BaseModule {
    /**
     * @param {Sequelize} connection
     */
    constructor(connection) {
        super();
        this.connection = connection;
        this.models = [];
    }

    /**
     * @param {Array<Model>} models
     */
    registerModels(models = []) {
        this.models = models;
        return this;
    }

    async #isConnect() {
        await this.connection.authenticate();
    }

    async #initModels() {
        const keySetter = [];
        this.models.forEach((plotter) => keySetter.push(plotter(this.connection)));
        keySetter.forEach((exec) => exec && exec(this.connection));
    }

    async beforeHandler(_) {
        try {
            await this.#isConnect();
            console.log("[Sequelize] Connection to database is established");
        } catch (ex) {
            console.error("[Sequelize] DataBase host is unreachable");
            console.log(ex.message);
            process.exit(1);
        }
    }

    async handler(_) {
        getConnection = () => this.connection;
    }

    async afterHandler(_) {
        await this.#initModels();
        console.log("[Sequelize] Models loaded");
    }
}

export default PostgresAdapter;
