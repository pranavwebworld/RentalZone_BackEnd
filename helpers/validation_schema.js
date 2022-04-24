const joi = require("joi")


const signupSchema = joi.object({

    email: joi.string().email().lowercase().required(),
    password: joi.string().min(2).required(),
    mobile: joi.string().length(10).required(),
    name: joi.string().required()

})

const loginSchema = joi.object({

    email: joi.string().email().lowercase().required(),
    password: joi.string().min(2).required(),
  
})


const ProductSchema = joi.object({

    address: joi.string().min(2).required(),

    productName: joi. string().min(2).required(),

    productDesc: joi.string().min(2).required(),

    rent: joi.required(),

    category: joi.string().min(2).required(),




    latitude: joi.required(),

    longitude: joi.required(),

    vendorId: joi.required()


})



const OrderSchema = joi.object({


    product: joi.required(),

    userId: joi.string().required(),

    total: joi.number().required(),

    Days: joi.required(),

    startingDate:joi.date().required(),

    endingDate:joi.date().required()


})





module.exports = {
    signupSchema, loginSchema,ProductSchema,OrderSchema


}