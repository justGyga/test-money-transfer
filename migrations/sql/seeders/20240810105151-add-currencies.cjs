const { default: axios } = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const APIResponse = await axios.get(`https://v6.exchangerate-api.com/v6/be871f45949b930264fe39c7/codes`);
        const { data } = APIResponse;
        const { supported_codes: supportedCodes } = data;
        const bulkCurrencies = [];
        let [codesInDB] = await queryInterface.sequelize.query(`SELECT code FROM currencies`);
        codesInDB = codesInDB.map(({ code }) => code);
        for (const [code, name] of supportedCodes) {
            if (!codesInDB.includes(code)) bulkCurrencies.push({ code, name });
        }
        if (!bulkCurrencies.length) return;
        await queryInterface.bulkInsert("currencies", bulkCurrencies);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DELETE FROM "currencies"`);
    }
};
