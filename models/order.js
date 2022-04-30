const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//CART
//We can create more than one schema in one file  itself -> here we are creating ProductCartSchema for the orderSchema

const ProductCartSchema = new mongoose.Schema({ //it is based on the products in product.js
    product:{
        type:ObjectId,
        ref : "Product"
    },
    name : String, //name of product
    count: Number, //how many products you are ordering
    price : Number, //single product 
});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema], //products in the cart
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: {
      //of user
      type: String,
    },
    status:{
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"] //example of plane corner seat vala and is used to restrict the state of order status
    },
    Update: {
      //for admin use to update the status of product
      type: Date,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order",orderSchema);

module.exports = {Order,ProductCart};