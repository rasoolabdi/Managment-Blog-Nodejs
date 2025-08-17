const { default: mongoose, model } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const AnswerSchema = new mongoose.Schema({
    user: {type: ObjectId , required: true , ref: "user"},
    post: {type: ObjectId , ref: "post"},
    content: {text: { type: String , required: true}},
    status: {type: Number , required: true , default: 0 , enum: [0, ,1 ,2]},
    openToComment: {type: Boolean , default: false}
} , {
    timestamps: { createdAt: true}
});

const CommentSchema = new mongoose.Schema({
    user: {type: ObjectId , ref: "user" , required: true},
    post: {type: ObjectId , ref: "post"},
    content: { text: { String , required: true} },
    status: {type: Number , required: true , default: 1 , enum: [0, 1, 2]},
    openToComment: {type: Boolean , default: true},
    answers: {type: [AnswerSchema] , default: []}
} , {
    timestamps: { createdAt: true }
});

const CommentModel = model("comment" , CommentSchema);
module.exports = CommentModel;
