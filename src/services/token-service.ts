import {MongoClient, ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {config} from "../config";
import {TokenModule} from "../models/Token";


type PayloadType = {
    id: ObjectId
    roles: string | string[]
}

type UserType = {
    id:string
}

const mongoUri = "mongodb+srv://vercel-admin-user:paradoxkulesh@test.mi4rsi6.mongodb.net/?retryWrites=true&w=majority";


const TokenClient = new MongoClient(mongoUri).db('productsDB').collection('Token')

export const tokenService = {

    generateTokens(id: ObjectId, roles: string | string[]) {
        const payload: PayloadType = {id, roles}
        const accessToken = jwt.sign(payload, config.accessToken, {expiresIn: '30s'})
        const refreshToken = jwt.sign(payload, config.refreshToken, {expiresIn: '15d'})
        return {accessToken, refreshToken}
    },
    async saveToken(userId: ObjectId, refreshToken: string) {
        const tokenData = await TokenClient.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            const filter = {user: userId}
            const updateDoc = {
                $set: {refreshToken: refreshToken}
            };
            return TokenClient.updateOne(filter, updateDoc)  //проверить работает ли

        }
        const token = await TokenClient.insertOne({user: userId, refreshToken})
        return token;
    },
    async removeToken(refreshToken: string) {
         await TokenClient.deleteOne({refreshToken})
        return {message:'okay'}
    },
    validateAccessToken(token:string){
        try {
            const userData = jwt.verify(token,config.accessToken)
            return userData as UserType
        }catch (e) {
            return null
        }
    },
    validateRefreshToken(token:string){
        try {
            const userData = jwt.verify(token,config.refreshToken)
            return userData as UserType
        }catch (e) {
            return null
        }
    },
    async findToken(refreshToken:string){
        try {

            const tokenData = await TokenClient.findOne({refreshToken})

            return tokenData?.refreshToken
        }catch (e) {
            return null
        }
    },

}
