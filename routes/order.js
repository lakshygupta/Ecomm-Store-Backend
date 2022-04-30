const express = require("express");
const router = express.Router();

const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {updateStock} = require("../controllers/product")
const {getOrderById, createOrder, getAllOrders,getOrderStatus,updateStatus,getOrder,getAllOrdersAdmin} = require("../controllers/order");

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//actual routes

//create
router.post("/order/create/:userId",isSignedIn, isAuthenticated, pushOrderInPurchaseList,updateStock,createOrder);

//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated, getAllOrders);
router.get("/order/:orderId",getOrder); //getting one product
router.get("/order/all/admin/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrdersAdmin); //get all orders for admin


//status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);

module.exports = router;