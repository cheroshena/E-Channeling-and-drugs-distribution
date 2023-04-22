const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var channelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shippingInfo: {
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        nic: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        other: {
            type: String,
            required: true
        },

    },
    orderItems: [
        {
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },

        }
    ],
    orderStatus: {
        type: String,
        default: "Ordered"
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Channel', channelSchema);