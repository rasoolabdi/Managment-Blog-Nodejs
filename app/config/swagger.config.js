const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const SwaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "Managment Blog",
                description: "project Managment Blog",
                version: "1.0.0"
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                } 
            },
            security: [{ BearerAuth: [] }]
        },
        apis: [process.cwd() + "/app/modules/**/*.swagger.js"]
    });
    const swagger = swaggerUi.setup(SwaggerDocument , {});
    app.use("/swagger" , swaggerUi.serve , swagger);
};

module.exports = swaggerConfig;