import mongoose from "mongoose"


// product Schema banaya ja raha hai

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    



}, { timestamps: true })



const Product = mongoose.model("Product", productSchema);
export default Product;
