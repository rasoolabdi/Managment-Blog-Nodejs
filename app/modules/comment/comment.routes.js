const { Router } = require("express");
const { AuthGuard } = require("../../middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const commentController = require("./comment.controller");
const router = Router();

router.post("/add" , AuthGuard , expressAsyncHandler(commentController.addNewComment));
router.patch("/update/:id" , AuthGuard , expressAsyncHandler(commentController.updateComment));
router.delete("/remove/:id" , AuthGuard , expressAsyncHandler(commentController.removeComment));

module.exports = {
    commentRoutesApi: router
}