const { Router } = require("express");
const { AuthRoutesApi } = require("./auth/auth.routes");
const { CategoryRoutesApi } = require("./category/category.routes");
const { postRoutesApi } = require("./post/post.routes");
const { commentRoutesApi } = require("./comment/comment.routes");
const router = Router();

router.use("/auth" , AuthRoutesApi);
router.use("/category" , CategoryRoutesApi);
router.use("/post" , postRoutesApi);
router.use("/comment" , commentRoutesApi);

module.exports = {
    mainAllRoutes: router
}