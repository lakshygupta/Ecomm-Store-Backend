const express = require("express");
const router = express.Router();

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts,getAllUniqueCategories } = require("../controllers/product");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById);

//actual routes

//create route
router.post("/product/create/:userId",  isSignedIn , isAuthenticated, isAdmin,createProduct);

//read routes
router.get("/product/:productId",getProduct); //getting one product
router.get("/product/photo/:productId",photo); // photo middleware

//delete route
router.delete("/product/:productId/:userId",  isSignedIn , isAuthenticated, isAdmin, deleteProduct);

//update route
router.put("/product/:productId/:userId",  isSignedIn , isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products",getAllProducts);

//list categories
router.get("/products/categories",getAllUniqueCategories);

module.exports = router;