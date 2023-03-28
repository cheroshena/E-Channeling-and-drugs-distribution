const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderprescSchema = new mongoose.Schema({
    prescriptions: [
        {
            prescription: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Doctor",
        },
        count:Number,
        },
    ],
    paymentIntent:{},
  
    orderStatus:{
        type: String,
        default:"Not Processed",
        enum:["Processing","Cancelled","Your Order is ready for Pick Up"],
    },
    orderby:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('OrderPresc', orderprescSchema);