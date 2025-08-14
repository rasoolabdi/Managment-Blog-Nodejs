const path = require("path");
const fs = require("fs");
const multer = require("multer");
const createHttpError = require("http-errors");


function createRoute(req , fieldName) {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDay().toString();
    const directory = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        fieldName,
        year,
        month,
        day
    );
    req.body.fileUploadPath = path.join("uploads" , fieldName , year , month , day);
    fs.mkdirSync(directory , { recursive: true });
    return directory
};

const storage = multer.diskStorage({
    destination: (req , file , cb) => {
        if(file?.originalname) {
            const filePath = createRoute(req , file.fieldname);
            return cb(null , filePath);
        };
        cb(null , null);
    },
    filename: (req , file , cb) => {
        if(file?.originalname) {
            const ext = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = String(uniqueSuffix + ext);
            req.body.filename = fileName;
            return cb(null , fileName);
        };
        cb(null , null);
    }
});

function fileFilter(req , file , cb) {
    const ext = path.extname(file.originalname);
    const mimeTypes = [".jpg" , ".jpeg" , ".png" , ".webp"];
    if(mimeTypes.includes(ext)) {
        return cb(null, true);
    };
    return cb(createHttpError.BadRequest("فرمت ارسال شده تصویر صحیح نمی باشد"))
};

const avatarMaxSize = 20 * 1000;
const uploadFile = multer({
    storage: storage,
    fileFilter,
    limits: {fileSize: avatarMaxSize}
});

module.exports = {
    uploadFile
};