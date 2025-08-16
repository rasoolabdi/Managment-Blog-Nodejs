const createHttpError = require("http-errors");
const Joi = require("joi");


async function AddNewCategorySchema(data) {
    const AddNewCategorySchema = Joi.object({
        title: Joi.string().required().min(3).max(50).error(createHttpError.BadRequest("عنوان فارسی دسته بندی صحیح نمی باشد . حداقل 3 حداکثر 50 کاراکتر مجاز می باشد")),
        englishTitle: Joi.string().required().min(3).max(50).error(createHttpError.BadRequest("عنوان انگلیسی دسته بندی صحیح نمی باشد . حداقل 3 و حداکثر 50 کاراکتر مجاز می باشد")),
        description: Joi.string().required().min(3).max(100).error(createHttpError.BadRequest("توضیحات دسته بندی صحیح نمی باشد . حداقل 3 و حداکثر 100 کاراکتر مجاز می باشد")),

    });
    return AddNewCategorySchema.validateAsync(data);
};

async function UpdateCategorySchema(data) {
    const updateCategorySchema = Joi.object({
        title: Joi.string().min(3).max(50).error(createHttpError.BadRequest("عنوان فارسی دسته بندی صحیح نمی باشد . حداقل 3 حداکثر 50 کاراکتر مجاز می باشد")),
        englishTitle: Joi.string().min(3).max(50).error(createHttpError.BadRequest("عنوان انگلیسی دسته بندی صحیح نمی باشد . حداقل 3 و حداکثر 50 کاراکتر مجاز می باشد")),
        description: Joi.string().min(3).max(100).error(createHttpError.BadRequest("توضیحات دسته بندی صحیح نمی باشد . حداقل 3 و حداکثر 100 کاراکتر مجاز می باشد"))
    });
    return updateCategorySchema.validateAsync(data);
};

module.exports = {
    AddNewCategorySchema,
    UpdateCategorySchema
}
