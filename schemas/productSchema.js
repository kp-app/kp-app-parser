import mongoose from 'mongoose'
const { Schema } = mongoose

const pricingSchema = new Schema({
    deliveryCost: Number,
    baseDiscount: Number,
    pricelistCost: Number,
    baseProfitMargin: Number,
    additionalProfitMargin: Number 
})

const productSchema = new Schema({
    fullName: String,

    basemodel: String,
    categoryName: String,
    specs: Object,
    subcategoryName: String,
    pricing: pricingSchema
})

const categorySchema = new Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}],
    subcategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'}],
    name: String 
})

const subcategorySchema = new Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}],
    name: String 
})

export const Products = mongoose.model('Products', productSchema)
export const Subcategory = mongoose.model('Subcategory', subcategorySchema)
export const Category = mongoose.model('Category', categorySchema)