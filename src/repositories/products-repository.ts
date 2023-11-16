import {MongoClient, ObjectId} from "mongodb";
import {v4} from 'uuid'
import {ProductModule} from "../models/Product";

const products = [{id: 1, title: 'tomato'}, {id: 2, title: 'cucumber'},]

const mongoUri = "mongodb+srv://vercel-admin-user:paradoxkulesh@test.mi4rsi6.mongodb.net/?retryWrites=true&w=majority";


type CommentsType = {
    message:string
    userId:string
}


const client = new MongoClient(mongoUri).db('productsDB').collection('products')

export const productRepository = {
    findProduct(searchTerm: string | null) {
        return products
    },
    async getProducts() {
        let res = await client.find({}).toArray()
        return res

    },
    async createProducts(title: string, price: number,img:string | undefined,userId:ObjectId,comments:CommentsType[]) {
        let id = v4()
        const product = new ProductModule({
            title,
            price,
            userId,
            image:`http://localhost:9000/${img}`,
            comments
        })
        await client.insertOne(product)
        return product
    },
    async updateProduct(id: string, title: string) {
        let res = await client.updateOne({id:id}, {$set:{title:title}})
        return res
    },
    async deleteProduct(id:string){
        let res = await client.deleteOne({id:id})
        return res
    },
    async addComment(productId:ObjectId,message:string,userId:string,userName:string){
        const comment = {
            message,
            userId,
            userName
        };

         await client.updateOne(
            { _id: new ObjectId(productId) },
            { $push: { comments: comment } }
        );

        return true
    },
    async deleteComment(productId:ObjectId,commentId:ObjectId){
            let res = await client.updateOne({
                _id:new ObjectId(productId)
            },{
                $pull:{comments:{_id:new ObjectId(commentId)}}
            })
            return {}
    }
}
