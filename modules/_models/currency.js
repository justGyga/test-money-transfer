import { DataTypes, Model } from "sequelize";
import { User } from "./user.js";

export class Currency extends Model {}

export const currencyPlotter = (connection) => {
    Currency.init(
        {
            code: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { sequelize: connection, timestamps: false, tableName: "currencies" }
    );

    return () => {
        Currency.hasMany(User, { foreignKey: "currencyId", as: "currency", onDelete: "SET NULL" });
    };
};
