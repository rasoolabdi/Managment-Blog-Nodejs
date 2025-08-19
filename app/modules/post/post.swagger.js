/**
 * @swagger
 *  tags:
 *      name: Post
 *      description: all routes posts
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addNewPost:
 *              type: object
 *              required: 
 *                  -   title
 *                  -   slug
 *                  -   briefText
 *                  -   category
 *                  -   type
 *                  -   text
 *                  -   readingTime
 *                  -   coverImage
 *              properties:
 *                  title: 
 *                      type: string
 *                      description: title of post
 *                  slug:
 *                      type: string
 *                      description: slug of post
 *                  briefText:
 *                      type: string
 *                      description: briefText of post
 *                  text: 
 *                      type: string
 *                      description: text of post
 *                  category:
 *                      type: string
 *                      description: category of post
 *                  type: 
 *                      type: string
 *                      enum: ["free" , "premium"]
 *                      description: type of post
 *                  readingTime:
 *                      type: number
 *                      description: readingTime of post
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: tags of post
 *                  related:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: related of post
 *                  coverImage:
 *                      type: file
 *                      format: binary
 *                      description: coverImage of post
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          UpdatePost:
 *              type: object
 *              properties:
 *                  title: 
 *                      type: string
 *                      description: title of post
 *                  slug:
 *                      type: string
 *                      description: slug of post
 *                  briefText:
 *                      type: string
 *                      description: briefText of post
 *                  text:
 *                      type: string
 *                      description: text of post
 *                  category:
 *                       type: string
 *                       description: category of post
 *                  type: 
 *                       type: string
 *                       enum: ["free" , "premium"]
 *                       description: type of post
 *                  readingTime:
 *                       type: number
 *                       description: reading time of post
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: tags of post
 *                  related:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: related of post
 *                  coverImage:
 *                       type: file
 *                       format: binary
 *                       description: coverImage of post
 *             
 */

/**
 * @swagger
 *  /api/post/add:
 *      post:
 *          tags: [Post]
 *          summary: create post
 *          description: create new post
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: "#/components/schemas/addNewPost"
 *          responses:
 *              201:
 *                  description: AddNewPost Successfully
 */

/**
 * @swagger
 *  /api/post/update/{id}:
 *      patch:
 *          tags: [Post]
 *          summary: update post 
 *          description: update post by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string    
 *                  description: id of post
 *          requestBody:
 *              content:
 *                 multipart/form-data:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdatePost"
 *          responses:
 *              200:
 *                  description: updatePost Successfully
 */

/**
 * @swagger
 *  /api/post/remove/{id}:
 *      delete:
 *              tags: [Post]
 *              summary: remove post
 *              description: remove post by id
 *              parameters:
 *                  -   name: id
 *                      in: path
 *                      required: true
 *                      type: string
 *                      description: id of post
 *              responses:
 *                  200:
 *                      description: removePost Successfully
 *                  
 */

/**
 * @swagger
 *  /api/post/{id}:
 *      get:
 *          tags: [Post]
 *          summary: get post
 *          description: get post by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string
 *                  description: id of post
 *          responses:
 *              200:
 *                  description: getPost Successfully
 */

/**
 * @swagger
 *  /api/post/like/{id}:
 *      post:
 *          tags: [Post]
 *          summary: like post
 *          description: like post by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string
 *                  description: id of post
 *          responses:
 *              200:
 *                  description: like post Successfully
 */

/**
 * @swagger
 *  /api/post/bookmark/{id}:
 *      post:
 *          tags: [Post]
 *          summary: bookmark post
 *          description: bookmark post by id
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  type: string
 *                  description: id of post
 *          responses:
 *              200:
 *                  description: bookmarked successfully
 */
