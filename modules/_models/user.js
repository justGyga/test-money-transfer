import { DataTypes, Model } from "sequelize";
import { Currency } from "./currency.js";
import { Transaction } from "./transaction.js";

export class User extends Model {}

export const userPlotter = (connection) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            login: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize: connection,
            updatedAt: false,
            tableName: "users"
        }
    );

    return () => {
        User.hasMany(Transaction, { foreignKey: "to", as: "transactionsTo", onDelete: "CASCADE" });
        User.hasMany(Transaction, { foreignKey: "from", as: "transactionsFrom", onDelete: "CASCADE" });
        User.belongsTo(Currency, { foreignKey: "currencyId", as: "currency", onDelete: "CASCADE" });
    };
};
