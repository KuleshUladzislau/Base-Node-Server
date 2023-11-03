import {MongoClient} from "mongodb";
import {v4} from 'uuid'

const products = [{id: 1, title: 'tomato'}, {id: 2, title: 'cucumber'},]

const mongoUri = process.env.mongoURI || 'mongodb://127.0.0.1:27017'


const client = new MongoClient(mongoUri)

export const productRepository = {
    findProduct(searchTerm: string | null) {
        return products
    },
    async getProducts() {
        let res = await client.db('productsDB').collection('products').find({}).toArray()
        return res

    },
    async createProducts(title: string, price: number) {
        let id = v4()
        let res = await client.db('productsDB').collection('products').insertOne({title, price, id})
        return res
    },
    async updateProduct(id: string, title: string) {
        let res = await client.db('productsDB').collection('products').updateOne({id:id}, {$set:{title:title}})
        return res
    },
    async deleteProduct(id:string){
        let res = await client.db('productsDB').collection('products').deleteOne({id})
        return res
    }
}
