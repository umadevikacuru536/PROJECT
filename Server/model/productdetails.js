const mongoose = require("mongoose");

const {schema} = mongoose;
const descriptionSchema=new mongoose.Schema({
    brand:String,
    features:String,
    features1:String,
    features2:String,
    features3:String
})
const ImagesSchema = new mongoose.Schema({
    imageUrl: String,
    imageUrl1: String,
    imageUrl2: String,
    imageUrl3: String,
})
  const productSchema = new mongoose.Schema({
   
   image:[ImagesSchema],
    title: String,
    price: Number,
    quantity: String,
    category:String
  });

  const Product = mongoose.model("product", productSchema);
   const productDetails = new mongoose.Schema({
    image: [ImagesSchema],
    title: String,
    price: Number,
    quantity: String,
    category:String,
    description:[descriptionSchema]
   });

   const ProductDetails = mongoose.model("ProductDetails",  productDetails);

   module.exports = {ProductDetails, Product};