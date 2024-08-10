import * as yup from "yup";
import { uuidArrayField } from "../../_commons/dto/uuid-dto.js";

export const listDto = yup.object().shape({
    startPosition: yup.number().integer().min(0).required(),
    limitPosition: yup.number().integer().min(0).required(),
    currencyIds: uuidArrayField
});
