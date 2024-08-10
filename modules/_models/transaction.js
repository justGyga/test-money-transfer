import { DataTypes, Model } from "sequelize";
import { User } from "./user.js";

export class Transaction extends Model {}

export const transactionPlotter = (connection) => {
    Transaction.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            amount: {
                type: DataTypes.FLOAT,
                validate: { min: 0.01 }
            }
        },
        {
            sequelize: connection,
            updatedAt: false,
            tableName: "transactions"
        }
    );

    return () => {
        Transaction.belongsTo(User, { foreignKey: "to", as: "toUser", onDelete: "CASCADE" });
        Transaction.belongsTo(User, { foreignKey: "from", as: "fromUser", onDelete: "CASCADE" });
    };
};
