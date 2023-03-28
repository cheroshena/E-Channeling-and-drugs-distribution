const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var prescriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    sold:{
        type:Number,
        default:0,

    },

    images:[],
});

//Export the model
module.exports = mongoose.model('Prescription', prescriptionSchema);