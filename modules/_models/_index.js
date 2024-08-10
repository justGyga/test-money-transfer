import { currencyPlotter } from "./currency.js";
import { transactionPlotter } from "./transaction.js";
import { userPlotter } from "./user.js";

export const models = [userPlotter, transactionPlotter, currencyPlotter];
