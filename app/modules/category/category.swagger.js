/**
 * @swagger
 * tags:
 *  name: Category
 *  description: all routes categories
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddCategory:
 *              type: object
 *              required:
 *                  -   title
 *                  -   englishTitle
 *                  -   description
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title persian of category
 *                  englishTitle: 
 *                      type: string
 *                      description: english title of category
 *                  description:
 *                      type: string
 *                      description: description of category
 */

/**
 * @swagger
 *  /api/category/add:
 *      post:
 *          tags: [Category]
 *          summary: add category
 *          description: add new category
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/AddCategory"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/AddCategory"
 *          responses:
 *              201:
 *                  description: addCategory Successfully
 * 
 */