import * as yup from "yup";

export const ratesDto = yup.object().shape({
    targets: yup.array().of(yup.string()).unique("targets is not unique").min(1).required()
});
