const createHttpError = require("http-errors");
const Controller = require("../controller");
const path = require("path");
const PostModel = require("./post.model");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { AddNewPostValidation, UpdatePostValidation } = require("./post.validation");
const { default: mongoose, model } = require("mongoose");
const { copyObject, deleteInvalidPropertiesInObject } = require("../../utils/functions");
const UserModel = require("../auth/user.model");
const commentController = require("../comment/comment.controller");
const { transformPost } = require("../../utils/transformPost");

class PostController extends Controller {
    constructor() {
        super();
    }

    async addNewPost(req , res , next) {
        try{
            const { fileUploadPath , filename , ...rest} = req.body;
            
            if(rest.related && typeof rest.related === "string") {
                rest.related = rest.related.split(",");
            };

            if(rest.tags && typeof rest.tags === "string") {
                rest.tags = rest.tags.split(",")
            };
            await AddNewPostValidation(rest);
            const {
                title,
                slug,
                briefText,
                type = "free",
                category,
                tags=[],
                text,
                readingTime,
                related=[]
            } = rest;
            const author = req.user._id;
            if(!fileUploadPath || !filename) {
                throw createHttpError.BadRequest("تصویر پروفایل را آپلود کنید")
            }
            const fileName = path.join(fileUploadPath , filename);
            const coverImage = fileName.replace( /\\/g , "/");

            const post = await PostModel.create({
                title,
                slug,
                briefText,
                type,
                category,
                tags,
                text,
                readingTime,
                related,
                coverImage,
                author
            });
            if(!post) {
                throw createHttpError.BadRequest("پست مورد نظر ثبت نشد")
            }

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data: {
                    message: "پست با موفقیت ایجاد شد",
                    post
                }
            })
        }
        catch(error) {
            next(error);
        }
    }

    async updatePost(req , res , next) {
        try {
            const { id } = req.params;
            const {fileUploadPath , filename , ...rest} = req.body;
            if(rest.related && typeof rest.related === "string") {
                rest.related = rest.related.split(",");
            };

            if(rest.tags && typeof rest.tags === "string") {
                rest.tags = rest.tags.split(",");
            };

            await this.findPostById(id);
            const data = copyObject(rest);
            let blackListFields = ["time" , "likes" , "bookmarks" , "comments" , "author"];
            deleteInvalidPropertiesInObject(data , blackListFields);            
            await UpdatePostValidation(rest);
            if(!fileUploadPath && !filename) {
                throw createHttpError.BadRequest("تصویر پروفایل را آپلود کنید")
            }

            const fileAddress = path.join(fileUploadPath , filename);
            const coverImage = fileAddress.replace("/\\/g" , "/");

            const updatePostResult = await PostModel.updateOne({_id: id} , {
                $set: {
                    ... data,
                    coverImage
                }
            });
            if(updatePostResult.modifiedCount === 0) {
                throw createHttpError.InternalServerError("به روز رسانی پست انجام نشد")
            };

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "به روز رسانی پست با موفقیت انجام شد"
                }
            })
        }
        catch(error) {
            next(error);
        }
    };

    async removePostById(req , res , next) {
        try {
            const {id} = req.params;
            await this.findPostById(id);
            const deleteResult = await PostModel.findByIdAndDelete(id);
            if(!deleteResult) {
                throw createHttpError.BadRequest("پست با شناسه مورد نظر حذف نشد")
            };
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "پست با شناسه مورد نظر با موفقیت حذف شد"
                }
            })
        }
        catch(error) {
            next(error);
        }
    }

    async getPostById(req , res ,next) {
        try {
            const {id} = req.params;
            const post = await PostModel.findById(id);
            if(!post) {
                throw createHttpError.BadRequest("پستی با این شناسه یافت نشد")
            }
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    post
                }
            })
        }
        catch(error) {
            next(error)
        }
    }

    async likePost(req , res , next) {
        try {
            const user = req.user;
            const { id: postId } = req.params;
            const post = await this.findPostById(postId);
            const likedPost = await PostModel.findOne({
                _id: postId,
                likes: user._id
            });

            const updatePostQuery = likedPost 
                ? {$pull: {likes: user._id} }
                : {$push: {likes: user._id} };

            const updateUserQuery = likedPost
                ? {$pull: {likedPosts: post._id} }
                : {$push: {likedPosts: post._id} };

            const updatePost  = await PostModel.updateOne({_id: postId} , updatePostQuery);
            const updateUser = await UserModel.updateOne({_id: user._id} , updateUserQuery);

            if(updatePost.modifiedCount === 0 || updateUser.modifiedCount === 0) {
                throw createHttpError.BadRequest("عملیات ناموفق بود")
            };
            let MessageLike = "";
            if(!likedPost) {
                MessageLike = "پست لایک شد"
            }
            else {
                MessageLike = "لایک پست برداشته شد"
            }
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: MessageLike
                }
            })
        }
        catch(error) {
            next(error);
        }
    }

    async bookmarkPost(req , res , next) {
        try {
            const {id: postId} = req.params;
            const user = req.user;
            const post = await PostModel.findById(postId);
            const bookmarkedPost = await PostModel.findOne({
                _id: postId,
                bookmarks: user._id
            });

            const updatePostBookmark = bookmarkedPost
                ? {$pull: {bookmarks: user._id} }
                : {$push: {bookmarks: user._id} }

            const updateUserBookmark = bookmarkedPost
                ?  {$pull: {bookmarkedPosts: post._id} } 
                :  {$push: {bookmarkedPosts: post._id} }

            const updatePost = await PostModel.updateOne({_id: postId} , updatePostBookmark);
            const updateUser = await UserModel.updateOne({_id: user._id} , updateUserBookmark);
            if(updatePost.modifiedCount === 0 || updateUser.modifiedCount === 0) {
                throw createHttpError.BadRequest("عملیات ناموفق بود")
            }

            let MessageBookmark;
            if(!bookmarkedPost) {
                MessageBookmark = "پست بوکمارک شد"
            }
            else {
                MessageBookmark = "بوکمارک پست برداشته شد"
            };
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: MessageBookmark
                }
            })
        }
        catch(error) {
            console.log(error)
            next(error);
        }
    }

    async getPostBySlug(req , res , next) {
        try {
            const { slug } = req.params;
            const user = req.user;
            const post = await PostModel.findOne({ slug }).populate([
                {path: "author" , model: "user" , select: {name: 1, biography: 1 , avatar: 1}},
                {path: "category" , model: "category" , select: {title: 1, slug: 1}},
                {path: "related" , model: "post" , select: {title: 1, slug: 1 , briefText: 1, coverImage: 1, author: 1},
                    populate: [
                        {path: "author" , model: "user" , select: {name: 1 , biography: 1 , avatar: 1}},
                        {path: "category" , model: "category" , select: {title: 1 , slug: 1}}
                    ]
                }
            ]);
            console.log(post);
            if(!post) {
                throw createHttpError.NotFound("پستی با این مشخصات یافت نشد")
            };
            const {id: postId} = post;
            const acceptedComments = await commentController.findAcceptedComments(postId);
            const transformedPost = copyObject(post);
            transformedPost.comments = acceptedComments;
            transformedPost.commentCount = acceptedComments.length + acceptedComments.reduce((acc , curr) =>
                acc + curr.answers.length , 0
            );
            await transformPost(transformedPost , user);
            
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    post: transformedPost
                }
            })

        }
        catch(error) {
            console.log(error);
            next(error);
        }
    }

    async findPostById(id) {
        if(!mongoose.isValidObjectId(id)) {
            throw createHttpError.BadRequest("شناسه پست معتبر نمی باشد")
        };

        const post = await PostModel.findById(id);
        if(!post) {
            throw createHttpError.BadRequest("پستی با این شناسه یافت نشد")
        };
        return post;
    }
};

module.exports = new PostController();