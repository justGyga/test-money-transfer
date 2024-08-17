import { Router } from "express";
import { CONTEXT, Validator } from "../../core/validation.js";
import { TokenGuard } from "../_commons/middlewares/token-guard.js";
import Controller from "./controller.js";
import { listDto } from "./dto/list.js";
import { transactionDto } from "./dto/post.js";

const router = new Router();
router.get("", TokenGuard.verify, Validator.validate(listDto, CONTEXT.QUERY), Controller.getList);
router.post("", TokenGuard.verify, Validator.validate(transactionDto), Controller.createTransaction);

export default router;
