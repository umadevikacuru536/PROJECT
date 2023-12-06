const express = require("express");  // IMPORTING EXPRESS MODULE FROM THIRD PARTY PACKAGE
const mongoose = require("mongoose"); // IMPORTING MONGOOSE
const cors = require("cors");
const address = require("./model/address");
const { Product, ProductDetails,Cart  } = require("./model/productdetails");
const app = express()
const userdata = require("./model/login")
app.use(express.json())  // ACCEPTING JSON FORMAT DATA AND PARSING TO LOCAL USER
app.use(cors({ origin: "*" }))
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
});

// address api

app.post("/address", async (req, res) => {
    try {
      const {
        FullName,
        mobileNumber,
        Flat,
        Area,
        Pincode,
        City,
        State
         } = req.body;
  
  
      let newUser = new address({
        FullName,
        mobileNumber,
        Flat,
        Area,
        Pincode,
        City,
        State
        
      });
  
      const isUserExist = await address.findOne({ });
      if (isUserExist) {
        return res.send("address already registered");
      }
  
      newUser.save(); //saving to mongodb collections
      res.send("address created succesfully");
    }
    catch (e) {
      console.log(e.message,"address");
      res.send("internal server error");
    }
  });



app.get("/alladdress", async (req, res) => {
    try {
        const alladdress = await address.find({}); 
        res.json({ address: alladdress });
    } catch (error) {
        console.error(error.message, "alladdress");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/addcart/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Assuming you have a Product model
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Fetch or create the cart
      const cart = await Cart.findOne({ productId: productId });
  
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
        return res.json({ success: true, cart: newCart, totalPrice: newCart.calculateTotalPrice() });
      } else {
        // Assuming Cart class has a static method to create an instance from an existing cart
        const existingCart = new Cart(cart);
        existingCart.addProduct(product, productId);
  
        // Save the updated cart
        await existingCart.save();
        return res.json({ success: true, cart: newCart, totalPrice: newCart.calculateTotalPrice() });

      }
    } catch (error) {
      console.error(error.message, "/addcart/:productId");
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.get("/allcart", async (req, res) => {
    try {
      const allCarts = await Cart.find({});
      let totalPrice = 0;
  
      allCarts.forEach((cart) => {
        for (const productId in cart.items) {
          const product = cart.items[productId].product;
          const quantity = cart.items[productId].quantity;
          totalPrice += product.price * quantity;
        }
      });
  
      res.json({ totalCartPrice: totalPrice, carts: allCarts });
    } catch (error) {
      console.error(error.message, "allcart");
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
app.listen(4444, () => {

    console.log("server running")
})













