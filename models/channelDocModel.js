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
    channelNo:{
        type:String,
        default:"Not Processed",
        enum:["Processing","01","02","03","04","05","06","07","08","09","10"],
    },
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