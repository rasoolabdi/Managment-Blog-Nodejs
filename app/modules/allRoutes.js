const { Router } = require("express");
const { AuthRoutesApi } = require("./auth/auth.routes");
const { CategoryRoutesApi } = require("./category/category.routes");
const { postRoutesApi } = require("./post/post.routes");
const router = Router();

router.use("/auth" , AuthRoutesApi);
router.use("/category" , CategoryRoutesApi);
router.use("/post" , postRoutesApi);

module.exports = {
    mainAllRoutes: router
}