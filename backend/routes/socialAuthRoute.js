import express from "express";
import { googleLogin } from "../controller/socialAuthController.js";

const socialAuthRouter = express.Router();

socialAuthRouter.post("/google", googleLogin);

export default socialAuthRouter;
