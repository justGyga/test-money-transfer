/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("transactions", {
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true
            },
            amount: {
                type: Sequelize.DataTypes.FLOAT,
                validate: { min: 0.01 }
            },
            to: {
                type: Sequelize.DataTypes.UUID,
                references: {
                    model: "users",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            from: {
                type: Sequelize.DataTypes.UUID,
                references: {
                    model: "users",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: new Date()
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP TABLE "transactions"`);
    }
};
