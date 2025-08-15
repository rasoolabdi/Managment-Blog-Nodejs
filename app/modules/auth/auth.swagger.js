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
 *  components:
 *      schemas:
 *          UpdateProfile:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: name of user
 *                  password:
 *                      type: string
 *                      description: password of user
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          updateAvatar:
 *              type: object
 *              required:
 *                  -   avatar
 *              properties:
 *                  avatar:
 *                      type: file
 *                      items:
 *                          type: string
 *                          format: binary
 *                          description: update avatar profile user                     
 * 
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
 *  /api/auth/list:
 *      get:
 *          tags: [Auth]
 *          summary: get all users
 *          description: get all list users
 *          responses:
 *              200:
 *                  description: getAllUsers Successfully
 */

/**
 * @swagger
 *  /api/auth/update:
 *      patch:
 *          tags: [Auth]
 *          summary: update profile
 *          description: update profile user by id
 *          requestBody:
 *              content: 
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateProfile"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateProfile"
 *          responses:
 *              200:
 *                  description: updateProfile Successfully
 */

/**
 * @swagger
 *  /api/auth/update-avatar:
 *      patch:
 *          tags: [Auth]
 *          summary: update avatar
 *          description: update avatar profile user
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: "#/components/schemas/updateAvatar"
 *          responses:
 *              200:
 *                  description: updateAvatar Successfully
 */

/**
 * @swagger
 *  /api/auth/profile:
 *      get:
 *          tags: [Auth]
 *          summary: profile user
 *          description: get profile user
 *          responses:
 *              200:
 *                  description: getProfile Successfully
 */

/**
 * @swagger
 *  /api/auth/logout:
 *      post:
 *          tags: [Auth]
 *          summary: logout of auth
 *          discription: logout of auth
 *          responses: 
 *              200:
 *                  description: logout successfully
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

