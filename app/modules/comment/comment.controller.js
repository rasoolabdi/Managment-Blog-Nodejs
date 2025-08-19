const { default: mongoose } = require("mongoose");
const Controller = require("../controller");
const CommentModel = require("./comment.model");
const { copyObject } = require("../../utils/functions");
const createHttpError = require("http-errors");
const ObjectId = new mongoose.Types.ObjectId();
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { AddNewCommentVlidation } = require("./comment.validation");


class CommentController extends Controller {
    constructor() {
        super();
    }

    async addNewComment(req , res , next) {
        try {
            const user = req.user;
            const { text , parentId , postId } = req.body;
            const content = { text };
            const status = 1;
            await AddNewCommentVlidation({ content , postId });

            if(parentId && mongoose.isValidObjectId(parentId)) {
                const parentComment = await this.findCommentById(parentId);
                if(parentComment && !parentComment?.openToComment) {
                    throw createHttpError.BadRequest("ثبت پاسخ برای این کامنت مجاز نیست")
                }
                const createAnswersResult = await CommentModel.updateOne({_id: parentId} , {
                    $push: {
                        answers: {
                            content,
                            post: postId,
                            user: user._id,
                            status,
                            openToComment: false
                        }
                    }
                })
                if(!createAnswersResult.matchedCount && !createAnswersResult.modifiedCount) {
                    throw createHttpError.BadRequest("پاسخی ثبت نشد")
                };
                return res.status(HttpStatus.CREATED).json({
                    statusCode: HttpStatus.CREATED,
                    data: {
                        message: "پاسخ پست با موفقیت ثبت شد . پس ازتایید قابل مشاهده است"
                    }
                })
            }
            else {
                const newComment = await CommentModel.create({
                    content,
                    post: postId,
                    user: user._id,
                    status,
                    openToComment: true
                });

                if(!newComment) {
                    throw createHttpError.InternalServerError("ثبت نظر انجام نشد")
                };
                return res.status(HttpStatus.CREATED).json({
                    statusCode: HttpStatus.CREATED,
                    data: {
                        message: "کامنت شما با موفقیت ثبت شد . پس از تایید قابل مشاهده خواهد بود"
                    }
                })
            }
        }
        catch(error) {
            console.log(error);
            next(error);
        }
    }

    async findCommentById(id) {
        const commentFindResult = await CommentModel.aggregate([
            {
                $project: {
                    answers: {
                        $concatArrays: [
                            "$answers",
                            [
                                {
                                    _id: "$_id",
                                    openToComment: "$openToComment",
                                    content: "$content",
                                    status: "$status"
                                }
                            ]
                        ]
                    }
                }
            },
            {
                $unwind: {
                    path: "$answers"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$answers"
                }
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            }
        ]);

        const comment = copyObject(commentFindResult);
        console.log("cc" , comment);
        if(!comment?.[0]) {
            throw createHttpError.NotFound("کامنتی با این مشخصات یافت نشد")
        };
        return comment?.[0];
    };

};

module.exports = new CommentController();