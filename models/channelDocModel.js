const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var channelSchema = new mongoose.Schema({
    doctors: [
        {
            doctor: {
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
        enum:["Processing","Cancelled","Done"],
    },
    orderby:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Channel', channelSchema);