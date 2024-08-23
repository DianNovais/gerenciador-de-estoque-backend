import { model, Schema } from "mongoose";
import product from "./ProductModel";

const sellSchema = new Schema({
    numberSell: {type: Number, require: true},
    products: [{
        productId: {require: true, type: Schema.Types.ObjectId},
        name: {require: true, type: String},
        quantity: {type: Number, require: true},
        value: {type: Number, require: true, default: 0}
    }],
    amount: {type: Number, require: true}
})

const Sell = model('sell', sellSchema);

export default Sell;