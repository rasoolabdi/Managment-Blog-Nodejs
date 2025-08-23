const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const PostModel = require("../modules/post/post.model");
const {intervalToDuration} = require("date-fns");

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

function toPersianDigits(n) {
    const farsiDigits = ["۰" , "۱" , "۲" , "۳" , "۴" , "۵" , "۶" , "۷" , "۸" , "۹"];
    return n.toString().replace(/\d/g , (x) => farsiDigits[parseInt(x)]);
}

async function calcuteDateDuration(endTime) {
    const {years , months , days , hours , minutes , seconds } = intervalToDuration({
        start: new Date(),
        end: new Date(endTime)
    });

    if(years) return `${toPersianDigits(years)} سال پیش`;
    if(months) return `${toPersianDigits(months)} ماه پیش`;
    if(days && days > 7)  {
        return `${toPersianDigits((days / 7).toFixed(0))} هفته پیش`
    };
    if(days) return `${toPersianDigits(days)} روز پیش`;
    if(hours) return `${toPersianDigits(hours)} ساعت پیش`;
    if(minutes) return `${toPersianDigits(minutes)} دقیقه پیش`;
    if(seconds) return `${toPersianDigits(seconds)} ثانیه پیش`
};

module.exports = {
    deleteInvalidPropertiesInObject,
    copyObject,
    checkPostExist,
    toPersianDigits,
    calcuteDateDuration
};