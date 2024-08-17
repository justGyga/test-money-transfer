import * as yup from "yup";

export const transactionDto = yup.object().shape({
    to: yup.string().uuid().required(),
    amount: yup.number().positive().required()
});
