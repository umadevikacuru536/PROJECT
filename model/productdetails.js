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

  const cartSchema = new mongoose.Schema({
    items: {
      type: Object,
      default: [Product],
    },
  });
  
  // Move the calculateTotalPrice method inside the schema definition
  cartSchema.methods.calculateTotalPrice = function () {
    let totalPrice = 0;
  
    // Iterate over items in the cart
    for (const productId in this.items) {
      if (this.items.hasOwnProperty(productId)) {
        const item = this.items[productId];
        totalPrice += item.product.price * item.quantity;
      }
    }
  
    return totalPrice;
  };
  
  // Create the Cart model
  const Cart = mongoose.model("Cart", cartSchema);
  
   const productDetails = new mongoose.Schema({
    image: [ImagesSchema],
    title: String,
    price: Number,
    quantity: String,
    category:String,
    description:[descriptionSchema]
   });

   const ProductDetails = mongoose.model("ProductDetails",  productDetails);

   module.exports = {ProductDetails, Product,Cart};