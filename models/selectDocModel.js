const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var selectdocSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },
        quantity: {
            type: Number,
            required: true
        },
        
    }, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('SelectDoc', selectdocSchema);