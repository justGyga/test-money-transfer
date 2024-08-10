export default {
    database: process.env.DB_NAME || "MONEY_TRANSFER",
    username: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "root",
    host: process.env.PG_HOST || "127.0.0.1",
    port: process.env.PG_PORT || 5432,
    dialect: "postgres"
};
