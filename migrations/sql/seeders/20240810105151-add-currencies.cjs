/* eslint-disable camelcase */
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await this.down(queryInterface, Sequelize);
        const APIResponse = await axios.get(`https://v6.exchangerate-api.com/v6/be871f45949b930264fe39c7/codes`);
        const { data } = APIResponse;
        const { supported_codes } = data;
        const bulkCurrencies = [];
        supported_codes.forEach(([code, name]) => bulkCurrencies.push({ id: uuidv4(), code, name }));
        await queryInterface.bulkInsert("currencies", bulkCurrencies);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DELETE FROM "currencies"`);
    }
};
