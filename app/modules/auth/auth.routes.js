const { Router } = require("express");
const authController = require("./auth.controller");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const router = Router();

router.post("/signup" , authController.signup);
router.get("/refresh-token" ,authController.verifyRefreshToken);

module.exports = {
    AuthRoutesApi: router
}