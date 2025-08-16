const { Router } = require("express");
const { AuthRoutesApi } = require("./auth/auth.routes");
const { CategoryRoutesApi } = require("./category/category.routes");
const router = Router();

router.use("/auth" , AuthRoutesApi);
router.use("/category" , CategoryRoutesApi);

module.exports = {
    mainAllRoutes: router
}