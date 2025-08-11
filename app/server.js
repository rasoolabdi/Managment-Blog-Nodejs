const express = require("express");
const { config } = require("dotenv");
const { default: mongoose } = require("mongoose");
const createHttpError = require("http-errors");
const swaggerConfig = require("./config/swagger.config");
const { mainAllRoutes } = require("./modules/allRoutes");
config();

class Application {
    #app = express();
    #DB_URI=process.env.MONGODB_URI
    constructor() {
        this.configServer();
        this.createServer();
        this.connectToDB();
        this.configRoutes();
        this.errorHandling();
    }

    async connectToDB() {
        mongoose.connect(`${this.#DB_URI}`).then((res) => {
            console.log("connected to DB")
        }).catch((error) => {
            console.log("ccan not connected to DB")
        })
    }

    async createServer() {
        const PORT = process.env.PORT;
        this.#app.listen(PORT, () => {
            console.log(`Application is running on port ${PORT}`)
        })
    }

    async configServer() {
        this.#app.use(express.urlencoded({extended: true}));
        this.#app.use(express.json());
        swaggerConfig(this.#app);
    }

    async configRoutes() {
        this.#app.use("/api" , mainAllRoutes);
    }

    async errorHandling() {
        this.#app.use((req , res , next) => {
            next(createHttpError.NotFound("صفحه مورد نظر یافت نشد"))
        });

        this.#app.use((error , req , res , next) => {
            const serverError = createHttpError.InternalServerError();
            const statusCode = error.status || serverError.status;
            const message = error.message || serverError.message;

            return res.status(statusCode).json({
                data: {
                    statusCode,
                    message
                }
            })
        })
    }

};

module.exports = Application;