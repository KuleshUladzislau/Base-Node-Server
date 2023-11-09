import {UserModel} from '../models/User'

import {MongoClient, ObjectId} from "mongodb";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {config} from '../config'


const mongoUri = "mongodb+srv://vercel-admin-user:paradoxkulesh@test.mi4rsi6.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(mongoUri)


const generateAccessToken = (id: ObjectId, roles: string | string[]) => {
    const payload = {id, roles}
    return jwt.sign(payload,config.secret,{expiresIn:'24h'})
}

export const authRepository = {
    async registration(userName: string, password: string) {
        const candidate = await client.db('productsDB').collection('roles').findOne({userName})

        if (candidate) {
            return false
        }
        const hashPassword = bcrypt.hashSync(password, 7);

        const user = new UserModel({
            userName: userName,
            password: hashPassword,
            roles: ['User']
        })
        await client.db('productsDB').collection('roles').insertOne(user)
        return true

    },

    async login(userName: string, password: string) {
        const user = await client.db('productsDB').collection('roles').findOne({userName})
        if (!user) return false

        const validPassword = bcrypt.compareSync(password, user.password)

        if (!validPassword) return {status: 400, message: 'invalid password'}

        const token = generateAccessToken(user._id,user.roles)

        if (validPassword) return {status: 200,token}



    },

    async me() {

    }
}


