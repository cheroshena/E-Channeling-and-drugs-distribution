const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    qulification: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    specialize: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    expirience: {
        type: String,
        required: true,
    },
    regno: {
        type: String,
        required: true,
    },
    timeduration: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,

    },
    images: [],
    docratings: [{
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    }],
    doctotalrating: {
        type: String,
        default: 0,
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Doctor', doctorSchema);
