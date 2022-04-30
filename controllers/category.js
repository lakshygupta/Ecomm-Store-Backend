const Category = require("../models/category");

//middleware code
exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,cate) => {
        if(err){
            return res.status(400).json({
                error:"Category not found in db"
            });
        }
        req.category = cate;
        next();
    });
};

//creating a category and saving it in db
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,category)=> {
        if(err){
            return res.status(400).json({
                error: "Not able to save Category in DB"
            })
        }
        res.json(category);
    });
};

//get the category only 1
exports.getCategory = (req,res) => { //getting a single category
    return res.json(req.category)
};

exports.getAllCategory = (req,res) => {
    Category.find().exec((err, cateogries) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(cateogries);
    });
};

//update the category only for admin use
exports.updateCategory = (req,res) => {
    const category = req.category; //req.category is coming from middleware [getCategoryById] which is written above and which is than populating teh variable category
    category.name = req.body.name;
    category.updatedAt = Date.now();
    category.save((err,updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update category"
            })
        }
        res.json(updatedCategory);
    });
};

//delete the category 
exports.removeCategory = (req,res) => {
    const category = req.category;//coming form middleware

    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete this category"
            })
        }
        res.json({
            message: `${category.name} is Sucessfully deleted!`
        });
    });
};