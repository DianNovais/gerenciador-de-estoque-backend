import mongoose, { Schema } from "mongoose";

const productModel = new Schema({
    name: {type: String, require: true},
    quantity: {type: Number, require: true, default: 0},
    value: {type: Number, require: true, default: 0}
}, {timestamps: true});

const product = mongoose.model('product', productModel);

export default product;