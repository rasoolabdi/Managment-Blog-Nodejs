const { default: mongoose, model } = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title: {type: String , required: true , unique: true},
    englishTitle: {type: String , required: true , unique: true},
    slug: {type: String , required: true , unique: true},
    description: {type: String , required: true},
    icon: {type: String , required: false}
} , {
    timestamps: true
});

const CategoryModel = model("category" , CategorySchema);
module.exports = CategoryModel;