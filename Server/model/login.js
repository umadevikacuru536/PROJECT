const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
    
     
    
      mobileNumber: {
        type: String,
        require: true,
      },
     otp: {
        type: String,
        require: true,
      }

    
     
})

const userdata=mongoose.model("userdata",productSchema);
module.exports =userdata;