import { model, Schema } from "mongoose";
import product from "./ProductModel";

const sellSchema = new Schema({
    numberSell: {type: Number, require: true},
    productsId: [{type: String, require: true}],
    amount: {type: Number, require: true}
})

const Sell = model('sell', sellSchema);

export default Sell;