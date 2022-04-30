const User = require("../models/user");
const Order = require("../models/order");
const formidable = require("formidable");
const _ = require("lodash");

exports.getUserById = (req, res, next, id) => {
  //works with params only
  User.findById(id).exec((err, user) => {
    //its a database callback and database callback always return error and user/data we are requesting from database
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in Database",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //works without params
  // console.log("here");
  //now this is also showing the salt and encry_password which is a private information and should not be displayed to user as such
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

//assignment -> vdo8.5
// exports.getUsers = (req, res) => {
//   User.find().exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: "No user was found in Database",
//       });
//     }
//     req.profile = user;
//     return res.json(req.profile);
//   });
// };

//update user personal information
exports.updateUser = (req, res) => {
    // console.log(req.body);
    let form = new formidable.IncomingForm(); //creating form
    form.keepExtensions = true; //to check whether the files are in png or jpg format

    form.parse(req,(err,fields,file) => { //parsing the form 
        if(err){
            return res.status(400).json({
                error: "Problem with the image"
            });
        }

        let profile = req.profile; // a new product is get from the requet based on this fields
        profile = _.extend(profile, fields) //using loadsh extend method to change the value of the variables
        // console.log(req.profile)
  User.findByIdAndUpdate(
    { _id: req.profile._id }, // on what basis you want to update the database
    { $set: profile }, //all the paramaters are updated that are send by the body
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.status(400).json({
          error: "You are not autherized to update the user in the database",
        });
      }
      console.log(user);
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
});
};

//update the purchase list
exports.userPurchaseList = (req,res) => {
  Order.find({user : req.profile._id})
  .populate("user", "_id name")
  .exec((err,order) => {
    if(err){
      return res.status(400).json({
        error: "No order in this account"
      })
    }
    return res.json(order)
  });
};

//middleware
exports.pushOrderInPurchaseList = (req,res,next) => {
  let purchases = []
  req.body.order.products.forEach(product => {
    purchases.push({
      _id : product._id,
      name: product.name,
      description : product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id 
    });
  });

  //store it in db
  User.findByIdAndUpdate(
    {_id: req.profile._id},//find user by id in db
    {$push: {purchases: purchases}},//update the purchases list of that user with the current purchases based on the user purchase
    {new: true},//this is because from the db send me the object which is updated one not the old one
    (err,purchases) => {
      if(err){
        return res.status(400).json({
          error: "Unable to save the purchase list"
        })
      }
      next();
    }
  )
}; 


exports.getAllUsersAdmin = (req,res) => {
  User.find({role:0}).select("_id name address email phoneno").exec((err, user) => {
      if(err){
          return res.status(400).json({
              error: "No User found"
          })
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
  });
};
