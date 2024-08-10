const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await this.down(queryInterface, Sequelize);
        const APIResponse = await axios.get("https://api.currencyfreaks.com/v2.0/currency-symbols");
        const { data } = APIResponse;
        const { currencySymbols } = data;
        const bulkCurrencies = [];
        Object.keys(currencySymbols).forEach((code) => bulkCurrencies.push({ id: uuidv4(), code, name: currencySymbols[code] }));
        await queryInterface.bulkInsert("currencies", bulkCurrencies);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DELETE FROM "currencies"`);
    }
};
