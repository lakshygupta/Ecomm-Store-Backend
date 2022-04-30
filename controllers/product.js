const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: " Product not found in DB"
            })
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm(); //creating form
    form.keepExtensions = true; //to check whether the files are in png or jpg format

    form.parse(req,(err,fields,file) => { //parsing the form 
        if(err){
            return res.status(400).json({
                error: "Problem with the image"
            });
        }
        //destructure the fields
        const {name, description, price, category, stock} = fields //{ ... } => coming from the models/product.js after this => photo = fields.photo

        //restrictions on fields
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let product = new Product(fields); // a new product is created based on this fields

        //handling the file
        if(file.photo){ // checking if the file coming is a photo or not
            if(file.photo.size > 3000000){// not allowing image greater than 3 mb
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path) //include the file in my product
            product.photo.contentType = file.photo.type; //mention the contentType for the database
        }

        //saving the photo to the db
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving Tshirt in the DB failed"
                })
            }
            res.json(product);
        })

    });
};

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){//checking if there is some data
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
};

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message : "Deletion of product Successfully",
            deletedProduct
        });
    });
};

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm(); //creating form
    form.keepExtensions = true; //to check whether the files are in png or jpg format

    form.parse(req,(err,fields,file) => { //parsing the form 
        if(err){
            return res.status(400).json({
                error: "Problem with the image"
            });
        }

        //updation code
        let product = req.product; // a new product is get from the requet based on this fields
        product = _.extend(product, fields) //using loadsh extend method to change the value of the variables

        //handling the file
        if(file.photo){ // checking if the file coming is a photo or not
            if(file.photo.size > 3000000){// not allowing image greater than 3 mb
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path) //include the file in my product
            product.photo.contentType = file.photo.type; //mention the contentType for the database
        }

        //saving the photo to the db
        product.updatedAt = Date.now();
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Updation Failed"
                })
            }
            res.json(product);
        })

    });
}


//products listing
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8; //provided by frontend user that how many products he want to have in display
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo") //dont select the photo
    .populate("category") //populate based on the category 
    .sort([[sortBy, "asc"]])
    // .limit(limit) //these are the only products that I want to show at once
    .exec((err,products) => { //get all products fromm db
        if(err){
            return res.status(400).json({
                error: "No product found"
            })
        }
        res.json(products); 
    });
};

//list all unique categories 
exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {} , (err,category) => {
        if(err){
            return res.status(400).json({
                error:"No category found"
            });
        }
        res.json(category);
    });
};

//updating the stocks and sold -> update inventary 
// middleware
exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod =>  {
        return { //object used in bulkWrite
            updateOne :{
                filter: {_id : prod._id},
                update:{$inc: {stock: -prod.count ,sold: +prod.count}} //prod.count is coming from frontend

            } 
        }
    })
    Product.bulkWrite(myOperations,{} , (err,products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk Operation Failed"
            })
        }
        next();
    });
};

