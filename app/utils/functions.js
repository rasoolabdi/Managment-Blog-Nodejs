const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const PostModel = require("../modules/post/post.model");


function deleteInvalidPropertiesInObject(data = {} , blackListFields = []) {
    let nullishData = ["" , " " , 0 , "0" , null , undefined];
    Object.keys(data).forEach((key) => {
        if(blackListFields.includes(key)) delete data[key];
        if(typeof data[key] === "string") data[key] = data[key].trim();
        if(Array.isArray(data[key]) && data[key].length > 0) {
            data[key] = data[key].map((item) => item.trim());
        }
        if(Array.isArray(data[key]) && data[key].length === 0) {
            delete data[key]
        }
        if(Array.isArray(key)) delete key;
        if(nullishData.includes(data[key])) {
            delete data[key]
        }
    });
};

function copyObject(object) {
    return JSON.parse(JSON.stringify(object))
};

async function checkPostExist(id) {
    if(!mongoose.isValidObjectId(id)) {
        throw createHttpError.BadRequest("شناسه پست ارسال شده صحیح نمی باشد")
    }
    const post = await PostModel.findById(id);
    if(!post) {
        throw createHttpError.NotFound("پستی با این شناسه یافت نشد")
    };
    return post;
}

module.exports = {
    deleteInvalidPropertiesInObject,
    copyObject,
    checkPostExist
};