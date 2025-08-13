const { Router } = require("express");
const authController = require("./auth.controller");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const router = Router();
const expressAsyncHandler = require("express-async-handler");


router.post("/signup" , expressAsyncHandler(authController.signup));
router.post("/signin" , expressAsyncHandler(authController.signin));
router.get("/list" , AuthGuard , expressAsyncHandler(authController.getAllUsers));
router.post("/logout" , AuthGuard , expressAsyncHandler(authController.logout));
router.get("/refresh-token" , expressAsyncHandler(authController.verifyRefreshToken));

module.exports = {
    AuthRoutesApi: router
}