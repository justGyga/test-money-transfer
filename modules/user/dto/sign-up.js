import * as yup from "yup";

export const SignUpDto = yup.object().shape({
    login: yup.string().min(1).max(24).required(),
    password: yup.string().min(6).max(24).required(),
    currencyId: yup.string().uuid().required()
});
