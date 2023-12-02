const express = require("express");  // IMPORTING EXPRESS MODULE FROM THIRD PARTY PACKAGE
const mongoose = require("mongoose"); // IMPORTING MONGOOSE
const cors = require("cors");
const {Product, ProductDetails} = require("./model/productdetails");
const app = express()
const userdata = require("./model/login")
app.use(express.json())  // ACCEPTING JSON FORMAT DATA AND PARSING TO LOCAL USER
app.use(cors({ origin: "*" }))
mongoose.connect("mongodb+srv://umadevikavuru:umadevi1234@cluster0.drlbwri.mongodb.net/ProductDetails?retryWrites=true&w=majority")
    .then((res) => console.log("db connected"))
    .catch((err) => console.log(err.message))
// main api
app.get("/", (req, res) => {
    res.send("hello world")
});

app.post('/otp', async (req, res) => {



//r

    try {
        const { mobileNumber } = req.body;

        // Generate a random 6-digit OTP
        function generateRandomCode(length) {
            const characters = '0123456789'; // Include characters you want in the code
            let code = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }

            return code;
        }

        const generatedOTP = generateRandomCode(6); // Generate a 6-digit OTP
        console.log('Generated OTP:', generatedOTP); // Log the OTP to the server console

        // Check if mobileNumber is provided and is a valid phone number
        const userExist = await userdata.findOne({ mobileNumber }); // Renamed the variable

        if (!userExist) {
            // Create a new user document with the OTP
            let newUser = new userdata({
                mobileNumber,
                otp: generatedOTP
            });

            // Save the new user document to the database
            await newUser.save();

            // Return a success response
            return res.status(200).json({ message: 'OTP sent successfully', otp: generatedOTP });
        } else {
            // If a user with the same mobile number already exists, return an error response
            return res.status(400).json({ message: 'User with the same mobile number already exists' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const addProducts = async () => {
    try {

        const productDetail = new ProductDetails({
            image:[
                {
                    imageUrl: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl1: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl2: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl3: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg"
                },
            ],
            
            title: "DETTOL LIQUID HAND WASH PUMP SKINCARE ",
            price: "60",
            quantity: "225 ML",
            category: "Skin Care",
            description: [
                {
                    brand: "Reckitt",
                    features: "100% Jems Protection",
                    features1: "100% Jems Protection",
                    features2: "100% Jems Protection",
                    features3: "100% Jems Protection"
                },
            ],

        });

        const savedproductDetail = await productDetail.save(); // saveJobDetails._id
        // Create and save a Job document that uses the same _id as the JobDetail

        const product = new Product({
            _id: savedproductDetail._id, // Use the same _id as the JobDetail
            image:[
                {
                    imageUrl: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl1: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl2: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg",
                    imageUrl3: "https://thmappbkk.blob.core.windows.net/boots/2021/5/18/211795ff-2956-456d-bfa9-99c9b7fbaa51_large.jpg"
                },
            ],
            title: "DETTOL LIQUID HAND WASH PUMP SKINCARE",
            price: "60",
            quantity: "225 ML",
            category: "Skin Care",
        });

    

    } catch (e) {
        console.log(e);
      
    }
};

// addProducts();


app.listen(4444, () => {

    console.log("server running")
})
