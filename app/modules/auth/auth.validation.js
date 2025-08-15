const createHttpError = require("http-errors");
const Joi = require("joi");


async function ValidationSignupSchema(data) {
    const SignupSchema = Joi.object({
        name: Joi.string().required().min(3).max(50).error(createHttpError.BadRequest("نام و نام خانوادگی حداقل 3 و حداکثر 50 کاراکتر مجاز است")),
        email: Joi.string().required().email().error(createHttpError.BadRequest("لطفا ایمیل معتبر وارد نمایید")),
        password: Joi.string().required().min(8).error(createHttpError.BadRequest("کلمه عبور حداقل 8 کاراکتر باید باشد"))
    });

    return SignupSchema.validateAsync(data);
};

async function ValidationSigninSchema(data) {
    const SigninSchema = Joi.object({
        email: Joi.string().required().email().error(createHttpError.BadRequest("لطفا ایمیل معتبر وارد نمایید")),
        password: Joi.string().required().min(8).error(createHttpError.BadRequest("کلمه عبور حداقل 8 کاراکتر باید باشد"))
    });
    return SigninSchema.validateAsync(data);
};

async function ValidationUpdateProfileSchema(data) {
    const updateProfileSchema = Joi.object({
        name: Joi.string().min(3).max(50).error(createHttpError.BadRequest("نام و نام خانوادگی حداقل 3 و حداکثر 50 کاراکتر باید باشد")),
        password: Joi.string().min(8).error(createHttpError.BadRequest("پسورد حداقل 8 کاراکتر باید باشد"))
    });
    return updateProfileSchema.validateAsync(data)
}

module.exports = {
    ValidationSignupSchema,
    ValidationSigninSchema,
    ValidationUpdateProfileSchema
}