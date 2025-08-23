const { Router } = require("express");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const postController = require("./post.controller");
const { uploadFile } = require("../../utils/multer");
const router = Router();

router.post("/add" , AuthGuard , uploadFile.single("coverImage") , expressAsyncHandler(postController.addNewPost));
router.patch("/update/:id" , AuthGuard , uploadFile.single("coverImage") , expressAsyncHandler(postController.updatePost));
router.delete("/remove/:id" , AuthGuard , expressAsyncHandler(postController.removePostById));
router.get("/:id" , AuthGuard , expressAsyncHandler(postController.getPostById));
router.post("/like/:id" , AuthGuard , expressAsyncHandler(postController.likePost));
router.post("/bookmark/:id" , AuthGuard , expressAsyncHandler(postController.bookmarkPost));
router.get("/slug/:slug" , AuthGuard , expressAsyncHandler(postController.getPostBySlug));

module.exports = {
    postRoutesApi: router
}