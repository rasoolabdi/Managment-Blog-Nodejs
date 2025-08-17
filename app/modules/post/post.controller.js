const createHttpError = require("http-errors");
const Controller = require("../controller");
const path = require("path");
const PostModel = require("./post.model");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { AddNewPostValidation } = require("./post.validation");

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
            console.log(error);
            next(error);
        }
    }

};

module.exports = new PostController();