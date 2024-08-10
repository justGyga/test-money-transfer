import { Router } from "express";
import { CONTEXT, Validator } from "../../core/validation.js";
import { uuidDto } from "../_commons/dto/uuid-dto.js";
import { TokenGuard } from "../_commons/middlewares/token-guard.js";
import Controller from "./controller.js";
import { listDto } from "./dto/list.js";
import { SignInDto } from "./dto/sign-in.js";
import { SignUpDto } from "./dto/sign-up.js";

const userRouter = new Router();
const authRouter = new Router();

authRouter.post("/in", Validator.validate(SignInDto), Controller.signIn);
authRouter.post("/up", Validator.validate(SignUpDto), Controller.signUp);

userRouter.get("", Validator.validate(listDto, CONTEXT.QUERY), Controller.getList);
userRouter.get("/me", TokenGuard.verify, Controller.getMe);
userRouter.get("/:id", Validator.validate(uuidDto, CONTEXT.PATH), Controller.getById);

export { authRouter, userRouter };
