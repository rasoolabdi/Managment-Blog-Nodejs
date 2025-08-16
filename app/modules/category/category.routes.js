const { Router } = require("express");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const categoryController = require("./category.controller");
const router = Router();

router.post("/add" , AuthGuard , expressAsyncHandler(categoryController.addNewCategory));
router.patch("/update/:id" , AuthGuard , expressAsyncHandler(categoryController.updateCategory));

module.exports = {
    CategoryRoutesApi: router
}