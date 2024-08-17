import * as yup from "yup";

export const listDto = yup.object().shape({
    startPosition: yup.number().integer().min(0).required(),
    limitPosition: yup.number().integer().min(0).required()
});
