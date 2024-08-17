import { Router } from "express";
import { CONTEXT, Validator } from "../../core/validation.js";
import { TokenGuard } from "../_commons/middlewares/token-guard.js";
import Controller from "./controller.js";
import { ratesDto } from "./dto/rates.js";

const router = new Router();
router.get("", TokenGuard.verify, Validator.validate(ratesDto, CONTEXT.QUERY), Controller.getRatesByOwnCurrency);

export default router;
