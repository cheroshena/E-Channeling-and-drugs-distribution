const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartprescSchema = new mongoose.Schema({
    prescriptions: [
        {
            prescription: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Prescription",
        },
        count:Number,
        
        },
    ],
    orderby:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('CartPresc', cartprescSchema);