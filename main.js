import { sessionWriter, mainPageUrl } from "./downloader.js"
import { getLinksToCats, getLinksToProducts } from "./linkExtractor.js"
import { parseProducts } from "./product.js"
import { Category, Products, Subcategory } from './schemas/productSchema.js'
import mongoose from 'mongoose'

const inserter = async (product, subcategoryName, categoryName) => {
    
    const productDoc = await Products.findOneAndUpdate({fullName: product.fullName}, product, {
        new: true,
        upsert: true
    })
    
    const subcategoryDoc = await Subcategory.findOneAndUpdate({name: subcategoryName}, {name: subcategoryName, $push: {products: productDoc._id}}, {
        new: true,
        upsert: true
    })
    const categoryDoc = await Category.findOneAndUpdate({name: categoryName}, {name: categoryName, $push: {
        products: productDoc._id,
        },
        $addToSet: {subcategories: subcategoryDoc._id}}, {
        new: true,
        upsert: true
    })
}

await mongoose.connect('mongodb+srv://@.mongodb.net/kp-app?retryWrites=true&w=majority');

let dbData = await parseProducts()

for (let [product, subcategoryName, categoryName] of dbData) {
    await inserter(product, subcategoryName, categoryName)
}

await mongoose.connection.close()
