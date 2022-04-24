const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { string, number, boolean } = require("joi");




const OrderSchema = new Schema({

    product: {
        type: Object,
        required: [true, "Productis required"],
       
    },

    userId: {
        type: String,
        required: [true, " vendorId is required"],
    },

    total: {
        type: Number,
        required: [true, " vendorId is required"],
    },

    Days: {
        type: Number,
        required: [true, " vendorId is required"],
    },

    startingDate: {

        type: Date,

    },

    Pending: {

        type: Boolean,
        default:true

    },

    Accepted: {

        type: Boolean,
        default: false

    },

    Returned:{

        type: Boolean,
        default: false

    },
    Rejected: {

        type: Boolean,
        default: false
    },

    endingDate:{

        type: Date,

    },

},
    {
        timestamps: true
    }
);



const Order = mongoose.model("order", OrderSchema );
module.exports = Order;
