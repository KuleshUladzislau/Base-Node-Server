import {MongoClient, ObjectId} from "mongodb";
import {v4} from 'uuid'

const products = [{id: 1, title: 'tomato'}, {id: 2, title: 'cucumber'},]

const mongoUri = "mongodb+srv://vercel-admin-user:paradoxkulesh@test.mi4rsi6.mongodb.net/?retryWrites=true&w=majority";





const client = new MongoClient(mongoUri).db('productsDB').collection('products')

export const productRepository = {
    findProduct(searchTerm: string | null) {
        return products
    },
    async getProducts() {
        let res = await client.find({}).toArray()
        return res

    },
    async createProducts(title: string, price: number,img:string | undefined,userId:ObjectId) {
        let id = v4()
        let res = await client.insertOne({title, price, userId,img:`https://base-node-server.vercel.app/${img}`})
        return res
    },
    async updateProduct(id: string, title: string) {
        let res = await client.updateOne({id:id}, {$set:{title:title}})
        return res
    },
    async deleteProduct(id:string){
        let res = await client.deleteOne({id:id})
        return res
    }
}
