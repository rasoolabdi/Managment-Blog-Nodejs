const { Router } = require("express");
const authController = require("./auth.controller");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const router = Router();

router.post("/signup" , authController.signup);
router.post("/signin" , authController.signin);
router.post("/logout" , AuthGuard , authController.logout);
router.get("/refresh-token" ,authController.verifyRefreshToken);

module.exports = {
    AuthRoutesApi: router
}