// eslint-disable-next-line import/no-extraneous-dependencies
import { Redis } from "ioredis";
import { BaseModule } from "../server.js";

// eslint-disable-next-line import/no-mutable-exports
export let redis = () => null;

class RedisAdapter extends BaseModule {
    #connection;
    /**
     * @param {{host: string, port: number, db: number, lazyConnect: boolean}} connection
     */
    constructor(connection) {
        super();
        this.#connection = connection;
    }

    async handler(_) {
        try {
            redis = () => new Redis(this.#connection);
            await redis().connect();
            console.log("[Redis] Connection is established ");
        } catch (error) {
            console.log(error);
            console.error("[Redis] Unable to connect");
        }
    }
}
export default RedisAdapter;
