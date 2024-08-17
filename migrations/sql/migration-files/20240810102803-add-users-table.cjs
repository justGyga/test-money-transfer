/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true
            },
            login: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            currencyId: {
                type: Sequelize.DataTypes.STRING,
                references: {
                    model: "currencies",
                    key: "code"
                },
                onDelete: "SET NULL"
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: new Date()
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP TABLE "users"`);
    }
};
