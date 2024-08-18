import watchdogTransactionsSender from "./watchdog-transactions-sender.js";

export const scheduler = [{ time: "0 * * * * *", job: watchdogTransactionsSender }];
