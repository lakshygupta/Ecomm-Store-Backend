const express = require("express")
const router = express.Router()

const {getUserById, getUser,updateUser, userPurchaseList,getAllUsersAdmin} = require("../controllers/user");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");


router.param("userId",getUserById); //middleware ->  it populated the req.profile in user/conteoller
router.get("/user/:userId",isSignedIn,isAuthenticated ,getUser);

//assignment -> vdo8.5
// router.get("/users",getUsers);

router.put("/user/update/:userId",isSignedIn,isAuthenticated, updateUser);
router.get("/orders/user/:userId",isSignedIn,isAuthenticated, userPurchaseList);
router.get("/user/all/:userId",isSignedIn,isAuthenticated,isAdmin, getAllUsersAdmin);
module.exports = router;
