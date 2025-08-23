const { default: mongoose, model } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new mongoose.Schema({
    title: {type: String , required: true},
    slug: {type: String , required: true , unique: true},
    category: {type: ObjectId , ref: "category" , required: true},
    type: {type: String , required: true , default: "free" , enum: ["free" , "premium"]},
    briefText: {type: String , required: true},
    text: {type: String , required: true},
    coverImage: {type: String , required: true , unique: true},
    likes: {type: [ObjectId] , ref: "user"},
    bookmarks: {type: [ObjectId] , ref: "user"},
    readingTime: {type: Number , required: true},
    tags: {type: [String] , required: false},
    author: {type: ObjectId , ref: "user"},
    related: {type: [ObjectId] , ref: "post"},
    comments: {type: [ObjectId] , ref: "comment"}
} , {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

PostSchema.virtual("coverImageUrl").get(function() {
    if(this.coverImage) return `${process.env.SERVER_URL}/${this.coverImage}`;
    return null;
})

const PostModel = model("post" , PostSchema);
module.exports = PostModel;