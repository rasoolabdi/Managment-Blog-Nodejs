const { Router } = require("express");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const postController = require("./post.controller");
const { uploadFile } = require("../../utils/multer");
const router = Router();

router.post("/add" , AuthGuard , uploadFile.single("coverImage") , expressAsyncHandler(postController.addNewPost));
router.patch("/update/:id" , AuthGuard , uploadFile.single("coverImage") , expressAsyncHandler(postController.updatePost));


module.exports = {
    postRoutesApi: router
}