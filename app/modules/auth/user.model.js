const { default: mongoose, model } = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    name: {type: String , required: true},
    email: {type: String , required: true , unique: true},
    password: {type: String , required: true},
    resetLink: {type: String , required: false},
    biography: {type: String , required: false},
    bookmarkedPosts: {type: [ObjectId] , ref: "post" , required: false},
    likedPosts: {type: [ObjectId] , ref: "post" , required: false},
    avatar: {type: String , required: false , default: null}
} , {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

const UserModel = model("user" , UserSchema);
module.exports = UserModel;