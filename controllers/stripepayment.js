const stripe = require('stripe')("#YOUR_TEXT_KEY")
const uuid = require("uuid/v4");


exports.makepayment = (req,res) => {
    const {products, token} =  req.body;
    console.log("PRODUCTS : ", products);
    let amount = 0;
       products.map(p => {
           amount = p.price + amount;
    });

    const idempotencyKey = uuid(); //for not charging the user again -> generates unique ID

    return stripe.customers.create({
        email : token.email,
        source : token.id
    }).then(customer => {
        stripe.charges.create({
            amount : amount,
            currency:"INR",
            customer : customer.id,
            receipt_email: token.email,
            description:"Purchased Done !",
            shipping:{
                name : token.card.name,
                address:{
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    postal_code:token.card.address_zip
                }
            }
        }, {idempotencyKey}).then(result => res.status(200).json(result))
        .catch(err=>console.log(err))
    });


}