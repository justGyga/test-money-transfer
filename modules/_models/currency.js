import { DataTypes, Model } from "sequelize";
import { User } from "./user.js";

export class Currency extends Model {}

export const currencyPlotter = (connection) => {
    Currency.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING
            },
            code: {
                type: DataTypes.SMALLINT
            }
        },
        { sequelize: connection, timestamps: false, tableName: "currencies" }
    );

    return () => {
        Currency.hasMany(User, { foreignKey: "currencyId", as: "currency", onDelete: "SET NULL" });
    };
};
