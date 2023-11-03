import {MongoClient} from "mongodb";
import * as mongoose from "mongoose";


const mongoUri = process.env.mongoURI || 'mongodb://127.0.0.1:27017'

const client = new MongoClient(mongoUri)


export async function runDB() {
    try {
        await client.connect()
        await client.db('productsDB')
    } catch {
        await client.close()
    }
}


