const createHttpError = require("http-errors");
const Controller = require("../controller");
const path = require("path");
const PostModel = require("./post.model");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { AddNewPostValidation, UpdatePostValidation } = require("./post.validation");
const { default: mongoose } = require("mongoose");
const { copyObject, deleteInvalidPropertiesInObject } = require("../../utils/functions");

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