const createHttpError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../utils/constants");


async function AddNewPostValidation(data) {
    const addNewPost = Joi.object({
        title: Joi.string().required().min(4).max(100).error(createHttpError.BadRequest("لطفا عنوان پست را وارد نمایید حداقل 4 و حداکثر 100 کاراکتر مجاز است")),
        slug: Joi.string().required().error(createHttpError.BadRequest("لطفا اسلاگ پست را وارد نمایید")),
        category: Joi.string().required().pattern(MongoIDPattern).error(createHttpError.BadRequest("لطفا شناسه دسته بندی را به درستی وارد نمایید")),
        text: Joi.string().required().error(createHttpError.BadRequest("لطفا متن پست را به درستی وارد نمایید")),
        briefText: Joi.string().required().error(createHttpError.BadRequest("لطفا خلاصه پست را به درستی وارد نمایید")),
        readingTime: Joi.number().required().error(createHttpError.BadRequest("لطفا زمان مطالعه پست را به درستی وارد نمایید")),
        type: Joi.string().required().regex(/(free|premium)/i).error(createHttpError.BadRequest("لطفا نوع پست را انتخاب نمایید")),
        related: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("لطفا پست های مرتبط صحیح وارد نمایید")),
        tags: Joi.array().items(Joi.string()).error(createHttpError.BadRequest("لطفا تگ های پست را صحیح وارد نمایید"))
    });
    return addNewPost.validateAsync(data);
}

async function UpdatePostValidation(data) {
    const updatePost = Joi.object({
        title: Joi.string().min(4).max(100).error(createHttpError.BadRequest("لطفا عنوان پست را وارد نمایید حداقل 4 و حداکثر 100 کاراکتر مجاز است")),
        slug: Joi.string().error(createHttpError.BadRequest("لطفا اسلاگ پست را وارد نمایید")),
        category: Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest("لطفا شناسه دسته بندی را به درستی وارد نمایید")),
        text: Joi.string().error(createHttpError.BadRequest("لطفا متن پست را به درستی وارد نمایید")),
        briefText: Joi.string().error(createHttpError.BadRequest("لطفا خلاصه پست را به درستی وارد نمایید")),
        readingTime: Joi.number().error(createHttpError.BadRequest("لطفا زمان مطالعه پست را به درستی وارد نمایید")),
        type: Joi.string().regex(/(free|premium)/i).error(createHttpError.BadRequest("لطفا نوع پست را انتخاب نمایید")),
        related: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("لطفا پست های مرتبط صحیح وارد نمایید")),
        tags: Joi.array().items(Joi.string()).error(createHttpError.BadRequest("لطفا تگ های پست را صحیح وارد نمایید"))
    });
    return updatePost.validateAsync(data);
};

module.exports = {
    AddNewPostValidation,
    UpdatePostValidation
};
