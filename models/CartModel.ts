import mongoose, { Schema } from "mongoose";



const CartSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, require: true, unique: true},
    products: {type: [{product_id: Schema.Types.ObjectId, quantity: Number, name: String}], require: true}
}, {timestamps: true});

CartSchema.index({user_id: 1});

const Cart = mongoose.model('cart', CartSchema);

export default Cart;