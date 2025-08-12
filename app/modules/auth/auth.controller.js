const Controller = require("../../controller");
const JWT = require("jsonwebtoken");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const UserModel = require("./user.model");
config();


class UserAuthController extends Controller {
    constructor() {
        super();
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