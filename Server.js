const express = require("express");  // IMPORTING EXPRESS MODULE FROM THIRD PARTY PACKAGE
const mongoose = require("mongoose"); // IMPORTING MONGOOSE
const cors = require("cors");
const address = require("./model/address");
const { Product, ProductDetails,Cart  } = require("./model/productdetails");
const app = express()
const userdata = require("./model/login")
app.use(express.json())  // ACCEPTING JSON FORMAT DATA AND PARSING TO LOCAL USER
app.use(cors({ origin: "*" }))
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': '',
    'client_secret': ''
});
mongoose.connect("mongodb+srv://umadevikavuru:umadevi1234@cluster0.drlbwri.mongodb.net/ProductDetails?retryWrites=true&w=majority")
    .then((res) => console.log("db connected"))
    .catch((err) => console.log(err.message))
// main api
app.get("/", (req, res) => {
    try{
    res.send("hello world");
    }catch(e){
        console.log(e.message,"/")
        res.status(500).json({ error: "Internal Server Error" });

    }
});

app.post('/otp', async (req, res) => {
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
        console.erro(error.message, "otp");
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const addProducts = async () => {
    try {

        const productDetail = new ProductDetails({
            image: [
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
            image: [
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

        await product.save();
        await mongoose.disconnect();

    } catch (e) {

        console.log(e.message,"addProducts");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// addProducts();

app.get("/products", async (req, res) => {
    try {
    const allproducts = await Product.find({}); //fetch all jobs from jobs schema
    res.json({ Product: allproducts })
    }catch (error) {
        console.error(error.message, "products");
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductDetails.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productcategory = product.category;

        const similarproducts = await Product.find({
            category: { $regex: productcategory, $options: 'i' },
            _id: { $ne: id }
        });

        res.status(200).json({ productDetails: product, similarproducts: similarproducts });
    } catch (error) {
        console.error(error.message,"/products/:id");
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// filters api

app.get("/filterproducts", async (req, res) => {
    try {
        const { category, price, search } = req.query;

        const query = {};
        if (category) {
            const categoryArray = category.split(',');

            query.category = { $in: categoryArray.map(type => new RegExp(type, 'i')) }
        }
        if (price) {
            const priceValue = parseFloat(price.replace(/\D+/g, ''));

            if (!isNaN(priceValue)) {
                query.price = { $gte: priceValue }
            }
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' }
        }

        const filteredproducts = await Product.find(query)

        if (filteredproducts.length === 0) {
            return res.status(404).json({ message: "no products found" })
        }
        return res.json(filteredproducts)

    } catch (e) {
        console.log(e.message, "filterproducts")
        return res.json({ message: "internal server error" })
    }
})
//    Server
// address api





app.get("/alladdress", async (req, res) => {
    try {
        const alladdress = await address.find({}); 
        res.json({ address: alladdress });
    } catch (error) {
        console.error(error.message, "alladdress");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));


app.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "Hat for the best team ever"
        }]
    };
    app.get('/success', (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "5.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.send('Success');
            }
        });
    });
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});
app.get('/cancel', (req, res) => res.send('Cancelled'));

app.post('/addcart/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Assuming you have a Product model
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Fetch or create the cart
      const cart = await Cart.findOne({productId:productId});
  
      if (!cart) {
        const newCart = new Cart({
          items: {
            [productId]: {
              product: product,
              quantity: 1,
            },
          },
        });
  
        await newCart.save();
        return res.json({ success: true, cart: newCart });
      } else {
        // Assuming Cart class has a static method to create an instance from an existing cart
        const existingCart = new Cart(cart);
        existingCart.addProduct(product, productId);
  
        // Save the updated cart
        await existingCart.save();
        return res.json({ success: true, cart: existingCart });
      }
    } catch (error) {
      console.error(error.message, "/addcart/:productId");
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  

app.listen(4444, () => {

    console.log("server running")
})













