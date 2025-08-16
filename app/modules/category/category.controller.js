const createHttpError = require("http-errors");
const Controller = require("../controller");
const CategoryModel = require("./category.model");
const { default: slugify } = require("slugify");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { AddNewCategorySchema } = require("./category.validation");

class CategoryController extends Controller {
    constructor() {
        super();
    }

    async addNewCategory(req , res , next) {
        try {
            const {title , englishTitle , description } = req.body;
            await AddNewCategorySchema(req.body);
            await this.findCategoryWithTitle(englishTitle);
            const category = await CategoryModel.create({
                title,
                englishTitle,
                description,
                slug: slugify(englishTitle)
            });
            if(!category) {
                throw createHttpError.BadRequest("دسته بندی مورد نظر ایجاد نشد")
            }

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data: {
                    message: "دسته بندی با موفقیت افزوده شد",
                    category
                }
            })
        }
        catch(error) {
            next(error)
        }
    }

    async findCategoryWithTitle(englishTitle) {
        const category = await CategoryModel.findOne({englishTitle});
        if(category) {
            throw createHttpError.BadRequest("دسته بندی با این عنوان وجود دارد")
        }
    }

    async checkExistsCategory(id) {
        const existsCategory = await CategoryModel.findById(id);
        if(!existsCategory) {
            throw createHttpError.BadRequest("دسته بندی مورد نظر با این شناسه یافت نشد")
        };
        return existsCategory;
    }
}

module.exports = new CategoryController();