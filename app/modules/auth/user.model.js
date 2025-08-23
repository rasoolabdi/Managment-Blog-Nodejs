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

UserSchema.virtual("avatarUrl").get(function() {
    if(this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
    return null;
});

UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.avatarUrl = this.avatarUrl;
    delete obj.password;
    return obj;
};

const UserModel = model("user" , UserSchema);
module.exports = UserModel;