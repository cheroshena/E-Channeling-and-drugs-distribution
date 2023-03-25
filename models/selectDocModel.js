const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var selectdocSchema = new mongoose.Schema({
    doctors: [
        {
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Doctor",
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
module.exports = mongoose.model('SelectDoc', selectdocSchema);