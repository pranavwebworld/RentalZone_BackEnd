const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { string, number } = require("joi");




const ProductSchema = new Schema({

    productName: {
        type: String,
        required:[true,"Product Name is required"],
        uppercase: true,
       
    },
    productDesc: {
        type: String,
        required: [true, "Product Description is required"],
    },
    category: {
        type: String,
        required: [true, "Product Category is required"],
    },
    rent: {
        type: Number,
        required: [true, "Product Category is required"],
    },
 
    latitude: {
        type: String,
        required: [true, "Product latitude is missing"],
    },

    longitude: {
        type: String,
        required: [true, "Product longitude is missing"],
    },


    address: {
        type: String,
        required:[true, "Product address is required"],
    },

    vendorId: {
        type: String,
        required: [true, " vendorId is required"],
    },

    cityName: {
        type: String,
        required: [true, " vendorId is required"],
    },

    Product_pic1: {

        type: String,
        
        default: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png?20170128014309"

    },
    Product_pic2: {

        type: String,

        default: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png?20170128014309"

    },
    Product_pic3: {

        type: String,

        default: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png?20170128014309"

    },
    inStock: {

        type: Boolean,

        default:true

    },
    location: {
        type: {
            type: String,
            enum: ['Point'], 
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
},
    {
        timestamps: true
    }
);



ProductSchema.pre('save', async function (next) {
    this.location = {
        type: 'Point',
        coordinates: [this.longitude, this.latitude],
    }
    next();
}, { timestamps: true });



const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
