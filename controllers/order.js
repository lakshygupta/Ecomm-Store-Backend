const { Order, ProductCart } = require("../models/order");
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") //products.product is coming from frontend
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found in DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.getOrder = (req,res) => { //getting a single order
  return res.json(req.order)
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order in DB",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => { //get order by USER ID
  Order.find()
    .populate("user", "_id name")
    .where('user').equals(req.params.userId)
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json(order);
    });
};


exports.getAllOrdersAdmin = (req,res) => {
  Order.find().exec((err, order) => {
      if(err){
          return res.status(400).json({
              error: "No orders found"
          })
      }
      res.json(order);
  });
};


exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues);    
};



exports.updateStatus = (req,res) => {
  const order = req.order;
  order.status = req.body.status;
  order.updatedAt = Date.now();
  order.save((err,updatedOrder) => {
    if(err){
        return res.status(400).json({
            error: "Failed to update order"
        })
    }
    res.json(updatedOrder);
});
};

exports.getOrderByUser = (req,res) => {
  
}