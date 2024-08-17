/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("currencies", {
            code: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP TABLE "currencies"`);
    }
};
