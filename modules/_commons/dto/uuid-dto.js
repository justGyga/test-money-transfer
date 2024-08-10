import * as yup from "yup";

const uuidField = yup.string().uuid();
const uuidDto = yup.object().shape({ id: uuidField.required() });
const uuidArrayField = yup.array().of(yup.string().uuid());
const uuidArrayDto = yup.object().shape({ ids: uuidArrayField.unique("array is not unique").min(1).required() });

export { uuidArrayDto, uuidArrayField, uuidDto, uuidField };
