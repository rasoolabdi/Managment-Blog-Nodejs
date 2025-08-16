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
 *          updateCategory:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title persian of category
 *                  englishTitle:
 *                      type: string
 *                      description: englishTitle of category
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

/**
 * @swagger
 *  /api/category/update/{id}:
 *      patch:
 *          tags: [Category]
 *          summary: update category
 *          description: update category by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string
 *                  description: id of category
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/updateCategory"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/updateCategory"
 *          responses:
 *              200:
 *                  description: update category Successfully
 */

/**
 * @swagger
 *  /api/category/list:
 *      get:
 *         tags: [Category]
 *         summary: get categories
 *         description: get all list categories
 *         responses:
 *              200:
 *                  description: list categories Successfully
 */