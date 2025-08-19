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