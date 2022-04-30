const express = require("express");
const router = express.Router();

const { getCategoryById,createCategory,getCategory, getAllCategory,updateCategory,removeCategory } = require("../controllers/category")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//params
router.param("userId",getUserById); //middleware ->  it populated the req.profile in user/conteoller
router.param("categoryId",getCategoryById);

//actual routes ======

//create a category
router.post("/category/create/:userId",isSignedIn,isAuthenticated, isAdmin,createCategory);

//read route
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);

//update route
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated, isAdmin,updateCategory);

//delete route
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated, isAdmin,removeCategory);

module.exports = router;