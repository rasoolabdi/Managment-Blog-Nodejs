/**
 * @swagger
 *  tags:
 *      name: Comment
 *      description: all route comments
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddNewComment:
 *              type: object
 *              required:
 *                  -   text
 *              properties:
 *                  text:
 *                      type: string
 *                      description: text of comment
 *                  postId: 
 *                      type: string
 *                      description: post id of post
 *                  parentId:
 *                      type: string
 *                      description: parent id of comment
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          UpdateStatusComment:
 *              type: object
 *              required:
 *                  -   status
 *              properties:
 *                  status:
 *                      type: number
 *                      enum: [0,1,2]
 *                      description: status of comment
*/

/**
 * @swagger
 *  /api/comment/add:
 *      post:
 *          tags: [Comment]
 *          summary: add comment
 *          description: add new comment
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/AddNewComment"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/AddNewComment"
 *          responses:
 *              201:
 *                  description: AddNewComment Successfully
 */

/**
 * @swagger
 *  /api/comment/update/{id}:
 *      patch:
 *          tags: [Comment]
 *          summary: update comment
 *          description: update comment by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string
 *                  description: id of comment
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateStatusComment"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateStatusComment"
 *          responses:
 *              200:
 *                  description: updateComment Successfully
 */

/**
 * @swagger
 *  /api/comment/remove/{id}:
 *      delete:
 *              tags: [Comment]
 *              summary: remove comment
 *              description: remove comment by id
 *              parameters:
 *                  -   name: id
 *                      in: path
 *                      type: string
 *                      description: id of comment
 *              responses:
 *                  200:
 *                      description: remove comment successfully
 */

/**
 * @swagger
 *  /api/comment/all:
 *      get:
 *          tags: [Comment]
 *          summary: get comments
 *          description: get all comments
 *          responses:
 *              200:
 *                  description: get All Comment Successfully
 */