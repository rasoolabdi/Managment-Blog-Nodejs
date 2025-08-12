const Controller = require("../controller");
const JWT = require("jsonwebtoken");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const UserModel = require("./user.model");
const { ValidationSignupSchema } = require("./auth.validation");
config();
const bcrypt = require("bcryptjs");
const { StatusCodes: HttpStatus } = require("http-status-codes");


class UserAuthController extends Controller {
    constructor() {
        super();
    }

    async signup(req,res,next) {
        try {
            await ValidationSignupSchema(req.body);
            const { name , email , password } = req.body;
            const existsUser = await this.checkUserExists(email);
            if(existsUser) {
                throw createHttpError.BadRequest("کاربری با این ایمیل وجود دارد")
            };

            const salt = await bcrypt.genSaltSync();
            const hashPassword = await bcrypt.hashSync(password , salt);

            const user = await UserModel.create({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashPassword
            });

            let WELLCOME_MESSAGE = "ثبت نام با موفقیت انجام شد"
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data: {
                    message: WELLCOME_MESSAGE,
                    user
                }
            })
        }
        catch(error) {
            console.log(error);
            next(error);
        }
    }

    async checkUserExists(email) {
        const user = await UserModel.findOne({email});
        return user;
    }


    async generateTokens(payload) {
        const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
        const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

        const accessToken = JWT.sign(payload , ACCESS_TOKEN_SECRET_KEY , {
            expiresIn: "7d"
        });

        const refreshToken = JWT.sign(payload , REFRESH_TOKEN_SECRET_KEY , {
            expiresIn: "30d"
        });

        return {accessToken , refreshToken}
    };


    async verifyRefreshToken(req , res , next) {
        try {
            const refreshToken = req.signedCookies["refreshTokenBlog"];
            const token = cookieParser.signedCookie(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY);
            if(!token)  {
                throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید")
            };

            const verified = JWT.verify(token , process.env.REFRESH_TOKEN_SECRET_KEY);
            if(verified?.userId) {
                const user = await UserModel.findById(verified?.userId);
                if(!user) {
                    throw createHttpError.Unauthorized("حساب کاربری یافت نشد")
                };
                const {accessToken , refreshToken} = await this.generateTokens({userId: user?._id});
                return res.json({
                    accessToken,
                    refreshToken
                })
            }
        }
        catch(error) {
            next(error);
        }
    }

};

module.exports = new UserAuthController();