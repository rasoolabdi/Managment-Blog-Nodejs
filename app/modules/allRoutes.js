const { Router } = require("express");
const { AuthRoutesApi } = require("./auth/auth.routes");
const router = Router();

router.use("/auth" , AuthRoutesApi);

module.exports = {
    mainAllRoutes: router
}