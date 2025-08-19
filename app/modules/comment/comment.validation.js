const createHttpError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../utils/constants");

const contentValidation = Joi.object().keys({
    text: Joi.string().required().min(10).max(200).error(createHttpError.BadRequest("لطفا متن کامنت صحیح را وارد نمایید . حداقل 10 حداکثر 200 کاراکتر مجاز می باشد"))
});

function AddNewCommentVlidation(data) {
    const addNewComment = Joi.object({
        content: contentValidation,
        postId: Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest("شناسه پست صحیح نمی باشد")),
    });
    return addNewComment.validateAsync(data);
};

module.exports = {
    AddNewCommentVlidation
}