const argon2 = require("argon2");
const { v4 } = require("uuid");
const { generateApiKey } = require("generate-api-key");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const [[codesInDB]] = await queryInterface.sequelize.query(`SELECT code FROM currencies LIMIT 1`);
        const password = await argon2.hash("SomePass");
        const bulkUsers = [];
        for (let i = 0; i < 10; i++) {
            bulkUsers.push({ id: v4(), login: generateApiKey({ method: "string", length: 40 }).replace(/\//g, "_"), password, currencyId: codesInDB.code });
        }
        await queryInterface.bulkInsert("users", bulkUsers);
    },

    async down(queryInterface, Sequelize) {}
};
