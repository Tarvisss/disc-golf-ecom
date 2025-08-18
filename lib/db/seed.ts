import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import data from '../data'
import { connectionToDatabase } from '.'
import Product from './models/product.model'

loadEnvConfig(cwd())

const main = async () => {
    try {
        const { products } = data
        await connectionToDatabase(process.env.MONGODB_URI)

        await Product.deleteMany()
        const createdProducts = await Product.insertMany(products)

        console.log({
            createdProducts,
            message: "seeded database successfully"
        })
        process.exit(0)
    } catch (error) {
        console.error(error)
        throw new Error("failed to seed database")
        
    }
}

main();