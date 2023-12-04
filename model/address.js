const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
    
     
    
      FullName: {
        type: String,
        require: true,
      },
      mobileNumber: {
        type: Number,
        require: true,
      },
     Flat: {
        type: String,
        require: true,
      },
      Area: {
        type: String,
        require: true,
      },
     Pincode: {
        type: String,
        require: true,
      },
      City: {
        type: String,
        require: true,
      },
     State: {
        type: String,
        require: true,
      }
    
     
})

const address=mongoose.model("address",productSchema);
module.exports =address;