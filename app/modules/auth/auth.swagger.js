/**
 * @swagger
 * tags:
 *      name: Auth
 *      description: All Routes Authentication User
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SignUp:
 *              type: object
 *              required:
 *                  -   name
 *                  -   email
 *                  -   password
 *              properties:
 *                  name:
 *                      type: string
 *                      description: name of user
 *                  email: 
 *                      type: string
 *                      description: email of user
 *                  password: 
 *                      type: string
 *                      description: password of user
 *          SignIn:
 *              type: object 
 *              required: 
 *                  -   email
 *                  -   password
 *              properties:
 *                  email:
 *                      type: string
 *                      description: email of user
 *                  password:
 *                      type: string
 *                      description: password of user
 */

/**
 * @swagger
 *  /api/auth/signup:
 *      post:
 *          tags: [Auth]
 *          summary: "signup user"
 *          description: "signup user"
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/SignUp"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/SignUp"
 *          responses:
 *              201:
 *                 description: register user successfully
 */

/**
 * @swagger
 *  /api/auth/signin:
 *      post:
 *          tags: [Auth]
 *          summary: "signin user"
 *          description: "signin user"
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/SignIn"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/SignIn"
 *          responses:
 *              200:
 *                  description: signin successfully
 */

/**
 * @swagger
 *  /api/auth/refresh-token:
 *      get:
 *          tags: [Auth]
 *          summary: refresh token
 *          description: create new accessToken and refreshToken
 *          responses:
 *              200:
 *                 description: create new accessToken and refreshToken successfully
 */
