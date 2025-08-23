const { default: mongoose } = require("mongoose");
const Controller = require("../controller");
const CommentModel = require("./comment.model");
const { copyObject, checkPostExist, calcuteDateDuration } = require("../../utils/functions");
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
            await checkPostExist(postId);
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
                        message: "پاسخ کامنت با موفقیت ثبت شد . پس ازتایید قابل مشاهده است"
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
            next(error);
        }
    }

    async updateComment(req , res , next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const comment = await this.findCommentById(id);
            if(comment && comment.openToComment) {
                const updateComment = await CommentModel.updateOne({_id: id} , {
                    $set: { status }
                });
                if(updateComment.modifiedCount === 0) {
                    throw createHttpError.BadRequest("وضعیت کامنت آپدیت نشد")
                }
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data: {
                        message: "وضعیت کامنت با موفقیت آپدیت شد"
                    }
                })
            }
            else {
                const updateResult = await CommentModel.updateOne({"answers._id": id} , {
                    $set: {
                        "$answers.$.status": status
                    }
                });
                if(updateResult.modifiedCount === 0) {
                    throw createHttpError.BadRequest("وضعیت پاسخ کامنت آپدیت نشد")
                }
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data: {
                        message: "وضعیت پاسخ کامنت با موفقیت آپدیت شد"
                    }
                })
            }
        }
        catch(error) {
            next(error)
        }
    }

    async removeComment(req , res , next) {
        try {
            const { id } = req.params;
            const comment = await this.findCommentById(id);
            if(comment && comment.openToComment) {
                const removeResult = await CommentModel.findByIdAndDelete({_id: id});
                if(removeResult.modifiedCount === 0) {
                    throw createHttpError.BadRequest("کامنت مورد نظر حذف نشد")
                }
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data: {
                        message: "کامنت مورد نظر با موفقیت حذف شد"
                    }
                })
            }
            else {
                const answerRemove = await CommentModel.updateOne({"answers._id": id} , {
                    $pull: {answers: {_id: id}}
                });
                if(answerRemove.modifiedCount === 0) {
                    throw createHttpError.BadRequest("پاسخ کامنت حذف نشد")
                }
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data: {
                        message: "پاسخ کامنت با موفقیت حذف شد"
                    }
                })
            }
        }
        catch(error) {
            next(error);
        }
    }

    async getAllComments(req , res , next) {
        try {
            const comments = await CommentModel.find({}).populate([
                {path: "user" , model: "user" , select: {name: 1}},
                {path: "answers.user" , model: "user" , select: {name: 1}}
            ]).sort({ createdAt: -1});
            if(!comments) {
                throw createHttpError.BadRequest("هیچ کامنتی یافت نشد")
            };
            const commentsCount = comments.length && comments.reduce((acc , curr) => acc + curr.answers.length , 0);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    comments,
                    commentsCount
                }
            })
        }
        catch(error) {
            next(error);
        }
    }

    async getCommentById(req , res , next) {
        try {
            const {id} = req.params;
            await this.findCommentById(id);
            const comment = await CommentModel.findById({_id: id}).populate([
                {path: "user" , model: "user" , select: {name: 1}},
                {path: "answers.user" , model: "user" , select: {name: 1}}
            ]).sort({ createdAt: -1});
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    comment
                }
            });
        }
        catch(error) {
            next(error);
        }
    }

    async findAcceptedComments(id , status = 2) {
        const acceptedComments = await CommentModel.aggregate([
            {
                $match: {
                    post: new mongoose.Types.ObjectId(id),
                    status
                }
            },
            {
                $project: {
                    status: 1,
                    _id: 1,
                    openToComment: 1,
                    content: 1,
                    user: 1,
                    createdAt: 1,
                    answers: {
                        $filter: {
                            input: "$answers",
                            as: "answers",
                            cond: {
                                $eq: ["answers.status" , status]
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: { name: 1 , biography: 1 , avatar: 1}
                        }
                    ]
                }
            },
            {
                $addFields: {
                    user: {
                        $map: {
                            input: "$user",
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        avatarUrl: {
                                            $concat: [process.env.SERVER_URL , "/" , "$$item.avatar"]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$user"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "answers.user",
                    foreignField: "_id",
                    as: "answerWriter",
                    pipeline: [
                        {
                            $project: {name: 1 , biography: 1, avatar: 1}
                        }
                    ]
                }
            },
            {
                $addFields: {
                    answerWriter: {
                        $map: {
                            input: "$answerWriter",
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        avatarUrl: {
                                            $concat: [process.env.SERVER_URL , "/" , "$$item.avatar"]
                                        }
                                    }
                                ]
                            }   
                        }
                    }
                }
            },
            {
                $project: {
                    content: 1,
                    user: 1,
                    status: 1,
                    openToComment: 1,
                    createdAt: 1,
                    _id: 1,
                    answers: {
                        $map: {
                            input: "$answers",
                            as: "item",
                            in: {
                                content: "$$item.content",
                                status: "$$item.status",
                                openToComment: "$$item.openToComment",
                                createdAt: "$$item.createdAt",
                                _id: "$$item._id",
                                user: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$answerWriter",
                                                as: "writer",
                                                cond: {
                                                    $eq: ["$$writer._id" , "$$item.user"],
                                                }
                                            }
                                        },
                                        0,
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        const transformed = acceptedComments.map((c) => {
            return {
                ... c,
                createdAt: calcuteDateDuration(c.createdAt),
                answers: c.answers.map((c) => {
                    return {...c , createdAt: calcuteDateDuration(c.createdAt)};
                })
            }
        });
        return copyObject(transformed);
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